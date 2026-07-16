import {
  channels, conversations, sessions, skills, models, threadData, defaultSettings
} from './js/data.js';
import {
  loadSettings, saveSettings, loadSkillState, saveSkillState,
  loadMemory, saveMemory, loadChannelState, saveChannelState
} from './js/storage.js';
import { $, $$, el, toast, escapeHtml } from './js/ui.js';

let settings = loadSettings(defaultSettings);
let skillState = loadSkillState();
let memory = loadMemory();
let channelState = loadChannelState();

function setPageTitle(title) {
  document.title = `${title} · OpenClaw Control`;
  $('#page-title').textContent = title;
}

function channelById(id) {
  return channels.find((c) => c.id === id) || { name: id, color: '#6b7280' };
}

function getRoute() {
  const raw = window.location.hash.replace('#', '') || 'chat';
  const [page, ...rest] = raw.split('/');
  return { page, param: rest.join('/') };
}

function setActiveLink(page) {
  $$('.nav-link').forEach((a) => a.classList.toggle('active', a.dataset.page === page));
}

function renderModelSelector() {
  const select = $('#model-selector');
  select.innerHTML = '';
  models.forEach((m) => {
    const opt = el('option', { value: m, text: m.split('/').pop() });
    if (settings.model === m) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => {
    settings.model = select.value;
    saveSettings(settings);
    toast(`Model switched to ${select.value}`, 'success');
  });
}

function renderAgentStatus() {
  $('#agent-dot').className = `status-dot ${settings.agentOnline ? 'online' : 'offline'}`;
  $('#agent-status').textContent = settings.agentOnline ? 'Agent online' : 'Agent offline';
}

function renderChat() {
  setPageTitle('Chat');
  const route = getRoute();
  const selectedId = route.param || conversations[0].id;
  const root = $('#page-content');
  root.innerHTML = '';

  const list = el('div', { class: 'conversation-list' });
  const chatSidebar = el('aside', { class: 'chat-sidebar' },
    el('div', { class: 'chat-search' },
      el('input', { type: 'text', placeholder: 'Search conversations...' })
    ),
    list
  );

  conversations.forEach((c) => {
    const ch = channelById(c.channel);
    const item = el('div', {
      class: `conversation ${c.id === selectedId ? 'active' : ''}`
    },
      el('div', {
        class: 'conv-avatar',
        style: `background:${ch.color}`,
        text: c.avatar
      }),
      el('div', { class: 'conv-body' },
        el('div', { class: 'conv-top' },
          el('div', { class: 'conv-name' }, c.name, el('span', { class: 'conv-channel', text: ch.name })),
          el('span', { class: 'conv-time', text: c.time })
        ),
        el('div', { class: 'conv-last', text: c.last })
      ),
      c.unread ? el('div', { class: 'unread', text: c.unread }) : null
    );
    item.addEventListener('click', () => {
      window.location.hash = `#chat/${c.id}`;
    });
    list.appendChild(item);
  });

  const threadPanel = el('section', { class: 'thread-panel' });
  const conv = conversations.find((c) => c.id === selectedId) || conversations[0];
  const ch = channelById(conv.channel);
  const messages = threadData[selectedId] || threadData[conv.id] || [];

  threadPanel.appendChild(el('div', { class: 'thread-header' },
    el('div', { class: 'conv-avatar', style: `background:${ch.color}`, text: conv.avatar }),
    el('div', {}, el('h3', { text: conv.name }), el('small', { text: ch.name }))
  ));

  const msgWrap = el('div', { class: 'thread-messages' });
  messages.forEach((m) => {
    const from = m.sender === 'agent' ? 'OpenClaw' : m.name;
    msgWrap.appendChild(el('div', { class: `message ${m.sender}` },
      el('div', { class: 'meta', text: `${from} · ${m.time}` }),
      el('div', { text: m.text }),
      m.tool ? el('div', { class: 'tool-trace', text: `> ${m.tool}` }) : null
    ));
  });

  const inputRow = el('div', { class: 'chat-search', style: 'border-top:1px solid var(--border); border-bottom:none;' },
    el('input', { type: 'text', placeholder: `Message ${conv.name} as agent...`, id: 'thread-input' })
  );
  const input = inputRow.querySelector('input');
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !input.value.trim()) return;
    const txt = input.value.trim();
    msgWrap.appendChild(el('div', { class: 'message user' },
      el('div', { class: 'meta', text: 'You · now' }),
      el('div', { text: txt })
    ));
    input.value = '';
    msgWrap.scrollTop = msgWrap.scrollHeight;
    setTimeout(() => {
      const lower = txt.toLowerCase();
      const isPing = /\bping\b|\bpong\b|pingpon/.test(lower);
      const replyText = isPing
        ? 'Opening the PingPON Arcade skill. You can train a neural net challenger or play against the best brain.'
        : 'Simulated reply: I’ve noted that and will act when channels are live.';
      const toolText = isPing ? '> skills.launch("pingpon")' : '> reasoning.simulate()';
      msgWrap.appendChild(el('div', { class: 'message agent' },
        el('div', { class: 'meta', text: 'OpenClaw · now' }),
        el('div', { text: replyText }),
        el('div', { class: 'tool-trace', text: toolText })
      ));
      if (isPing) {
        msgWrap.appendChild(el('div', { class: 'message agent' },
          el('a', { class: 'btn', href: '#arcade', text: '🏓 Open Arcade' })
        ));
      }
      msgWrap.scrollTop = msgWrap.scrollHeight;
    }, 600);
  });

  threadPanel.appendChild(msgWrap);
  threadPanel.appendChild(inputRow);

  const page = el('div', { class: 'page page-chat' }, chatSidebar, threadPanel);
  root.appendChild(page);
}

function renderSessions() {
  setPageTitle('Sessions');
  const grid = el('div', { class: 'cards' });
  sessions.forEach((s) => {
    grid.appendChild(el('div', { class: 'card' },
      el('div', { class: 'card-header' },
        el('h3', { text: s.label }),
        el('span', { class: `status-pill ${s.status}`, text: s.status })
      ),
      el('p', { text: `Workspace: ${s.workspace}` }),
      el('p', { text: `Channels: ${s.channel}` }),
      el('div', { class: 'card-meta', text: `Session ID: ${s.id}` })
    ));
  });
  $('#page-content').appendChild(el('div', { class: 'page page-sessions' },
    el('div', { class: 'section-header' },
      el('h2', { text: 'Active Sessions' }),
      el('p', { text: 'Where your agent process is running and listening.' })
    ),
    grid
  ));
}

function renderChannels() {
  setPageTitle('Channels');
  const grid = el('div', { class: 'cards page-channels' });
  channels.forEach((c) => {
    const state = channelState[c.id] || { connected: true, mentions: 'group' };
    const card = el('div', { class: 'card', 'data-channel': c.id },
      el('div', { class: 'card-header' },
        el('div', { style: 'display:flex;align-items:center;gap:.6rem' },
          el('div', { class: 'conv-avatar', style: `background:${c.color}`, text: c.icon }),
          el('h3', { text: c.name })
        ),
        el('span', { class: `status-pill ${state.connected ? 'active' : 'offline'}`, text: state.connected ? 'connected' : 'disabled' })
      ),
      el('p', { text: 'Receive and send messages through this channel.' }),
      el('div', { class: 'channel-row' },
        el('label', { text: 'Connected' }),
        el('button', {
          class: 'btn secondary',
          text: state.connected ? 'On' : 'Off',
          onClick: () => {
            channelState[c.id] = { ...state, connected: !state.connected };
            saveChannelState(channelState);
            renderChannels();
          }
        })
      ),
      el('div', { class: 'channel-row' },
        el('label', { text: 'Mention rule' }),
        el('select', { 'data-mention': c.id },
          el('option', { value: 'all', text: 'All messages' }),
          el('option', { value: 'group', text: 'Group mentions' }),
          el('option', { value: 'dm', text: 'DMs only' }),
          el('option', { value: 'none', text: 'Never' })
        )
      )
    );
    card.querySelector(`select[data-mention="${c.id}"]`).value = state.mentions;
    card.querySelector('select').addEventListener('change', (e) => {
      channelState[c.id] = { ...state, mentions: e.target.value };
      saveChannelState(channelState);
    });
    grid.appendChild(card);
  });
  $('#page-content').appendChild(el('div', { class: 'page page-grid' },
    el('div', { class: 'section-header' },
      el('h2', { text: 'Channels' }),
      el('p', { text: 'Toggle gateway connections and mention rules per channel.' })
    ),
    grid
  ));
}

function renderSkills() {
  setPageTitle('Skills / ClawHub');
  const grid = el('div', { class: 'skill-grid' });
  skills.forEach((s) => {
    const active = skillState[s.id] ?? s.active;
    const card = el('div', { class: `skill-card ${active ? 'active' : ''}` },
      el('div', { class: 'skill-top' },
        el('span', { class: 'skill-icon', text: s.icon }),
        el('div', { class: 'toggle' })
      ),
      el('h3', { class: 'skill-name', text: s.name }),
      el('p', { class: 'skill-desc', text: s.desc })
    );
    card.addEventListener('click', () => {
      skillState[s.id] = !skillState[s.id];
      saveSkillState(skillState);
      renderSkills();
      toast(`${s.name} ${skillState[s.id] ? 'enabled' : 'disabled'}`, 'success');
    });
    grid.appendChild(card);
  });
  $('#page-content').appendChild(el('div', { class: 'page page-grid' },
    el('div', { class: 'section-header' },
      el('h2', { text: 'Skills / ClawHub' }),
      el('p', { text: 'Install and enable tools the agent can invoke across channels.' })
    ),
    grid
  ));
}

function renderArcade() {
  setPageTitle('Arcade');
  const root = $('#page-content');
  root.innerHTML = '';

  const tabs = el('div', { class: 'arcade-tabs' },
    el('button', { class: 'tab-btn active', 'data-tab': 'train', text: 'Train AI' }),
    el('button', { class: 'tab-btn', 'data-tab': 'arena', text: 'Play vs AI' })
  );

  const frameTrain = el('iframe', { class: 'arcade-frame', src: 'https://rick21-bit.github.io/pingpon/index.html', 'data-tab': 'train' });
  const frameArena = el('iframe', { class: 'arcade-frame', style: 'display:none', src: 'https://rick21-bit.github.io/pingpon/arena.html', 'data-tab': 'arena' });

  tabs.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      [frameTrain, frameArena].forEach((f) => {
        f.style.display = f.dataset.tab === tab ? 'block' : 'none';
      });
    });
  });

  const page = el('div', { class: 'page page-arcade' },
    el('div', { class: 'section-header' },
      el('h2', { text: 'PingPON Arcade' }),
      el('p', { text: 'OpenClaw can train neural-network pong players or challenge you in the arena.' })
    ),
    tabs,
    el('div', { class: 'arcade-frames' }, frameTrain, frameArena)
  );
  root.appendChild(page);
}

function renderMemory() {
  setPageTitle('Memory');
  const list = el('div', { class: 'memory-list' });
  function refresh() {
    list.innerHTML = '';
    if (!memory.length) {
      list.appendChild(el('p', { class: 'empty-state', text: 'No memories yet. Add one above.' }));
    }
    memory.forEach((entry) => {
      list.appendChild(el('div', { class: 'memory-item' },
        el('p', { text: entry.text }),
        el('time', { text: new Date(entry.ts).toLocaleString() }),
        el('button', {
          class: 'icon-btn', text: 'Delete',
          onClick: () => {
            memory = memory.filter((m) => m.id !== entry.id);
            saveMemory(memory);
            refresh();
          }
        })
      ));
    });
  }
  const input = el('input', { type: 'text', placeholder: 'e.g. I prefer concise bullet-point answers', required: true });
  const form = el('form', { class: 'memory-form' },
    input,
    el('button', { class: 'btn', type: 'submit', text: 'Add entry' })
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    memory.push({ id: crypto.randomUUID(), text: input.value.trim(), ts: Date.now() });
    saveMemory(memory);
    input.value = '';
    refresh();
    toast('Memory saved.', 'success');
  });
  refresh();
  $('#page-content').appendChild(el('div', { class: 'page page-memory' },
    el('div', { class: 'section-header' },
      el('h2', { text: 'Memory' }),
      el('p', { text: 'Persistent facts the agent uses across sessions.' })
    ),
    form,
    list
  ));
}

function renderSettings() {
  setPageTitle('Settings');
  const modelSelect = el('select', { id: 'setting-model' });
  models.forEach((m) => modelSelect.appendChild(el('option', { value: m, text: m })));
  modelSelect.value = settings.model;

  const providerInput = el('input', { id: 'setting-provider', type: 'text', value: settings.provider });
  const apiBaseInput = el('input', { id: 'setting-apiBase', type: 'text', value: settings.apiBase });
  const apiKeyInput = el('input', { id: 'setting-apiKey', type: 'password', value: settings.apiKey, placeholder: 'sk-...' });
  const allowlistInput = el('input', { id: 'setting-allowlist', type: 'text', value: settings.allowlist });
  const logSelect = el('select', { id: 'setting-logLevel' });
  ['debug', 'info', 'warn', 'error'].forEach((l) => logSelect.appendChild(el('option', { value: l, text: l })));
  logSelect.value = settings.logLevel;

  const agentToggle = el('input', { id: 'setting-online', type: 'checkbox' });
  agentToggle.checked = settings.agentOnline;

  const form = el('form', { class: 'settings-form' },
    el('label', {}, 'Model', modelSelect),
    el('label', {}, 'Provider', providerInput),
    el('label', {}, 'API base URL', apiBaseInput),
    el('label', {}, 'API key', apiKeyInput),
    el('label', {}, 'Allowlist', allowlistInput),
    el('label', {}, 'Log level', logSelect),
    el('label', { style: 'flex-direction:row;align-items:center;gap:.5rem' }, agentToggle, ' Agent online'),
    el('div', { class: 'form-actions' },
      el('button', { class: 'btn', type: 'submit', text: 'Save settings' })
    )
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    settings = {
      model: modelSelect.value,
      provider: providerInput.value,
      apiBase: apiBaseInput.value,
      apiKey: apiKeyInput.value,
      allowlist: allowlistInput.value,
      logLevel: logSelect.value,
      agentOnline: agentToggle.checked
    };
    saveSettings(settings);
    renderAgentStatus();
    renderModelSelector();
    toast('Settings saved.', 'success');
  });
  $('#page-content').appendChild(el('div', { class: 'page page-settings' },
    el('div', { class: 'section-header' },
      el('h2', { text: 'Settings' }),
      el('p', { text: 'Configure the model, provider, network, and runtime behavior.' })
    ),
    form
  ));
}

function route() {
  const { page } = getRoute();
  $('#page-content').innerHTML = '';
  setActiveLink(page);
  switch (page) {
    case 'chat': renderChat(); break;
    case 'sessions': renderSessions(); break;
    case 'channels': renderChannels(); break;
    case 'skills': renderSkills(); break;
    case 'arcade': renderArcade(); break;
    case 'memory': renderMemory(); break;
    case 'settings': renderSettings(); break;
    default: window.location.hash = '#chat';
  }
}

function init() {
  renderModelSelector();
  renderAgentStatus();

  $('#menu-btn')?.addEventListener('click', () => $('#sidebar').classList.toggle('closed'));

  $('#quick-memory').addEventListener('click', () => {
    window.location.hash = '#memory';
  });
  $('#restart-agent').addEventListener('click', () => {
    toast('Agent restarted successfully.', 'success');
  });

  window.addEventListener('hashchange', route);
  route();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
