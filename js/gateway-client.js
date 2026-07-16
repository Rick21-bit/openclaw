let state = {
  url: localStorage.getItem('oc_gateway_url') || 'http://localhost:3000',
  clientId: localStorage.getItem('oc_gateway_id') || null,
  type: 'openclaw',
  connected: false,
  messages: []
};

let eventSource = null;

function save() {
  localStorage.setItem('oc_gateway_url', state.url);
  if (state.clientId) localStorage.setItem('oc_gateway_id', state.clientId);
}

export function getState() { return state; }

export function setUrl(url) {
  state.url = url;
  save();
}

export async function register() {
  const res = await fetch(`${state.url}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: state.type, meta: { name: 'OpenClaw Control' } })
  });
  if (!res.ok) throw new Error('Registration failed');
  const data = await res.json();
  state.clientId = data.id;
  save();
  return data.id;
}

export async function send(to, payload) {
  if (!state.clientId) throw new Error('Not registered');
  const res = await fetch(`${state.url}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: state.clientId, to, payload })
  });
  if (!res.ok) throw new Error('Send failed');
  return res.json();
}

export async function listClients() {
  const res = await fetch(`${state.url}/clients`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  const data = await res.json();
  return data.clients;
}

export async function gameMove(agent, paddle, direction) {
  return fetch(`${state.url}/game/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent, paddle, direction })
  });
}

export function connect(onMessage) {
  if (!state.clientId) return;
  if (eventSource) { eventSource.close(); }
  eventSource = new EventSource(`${state.url}/events/${state.clientId}`);
  state.connected = true;

  eventSource.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      state.messages.unshift(msg);
      if (state.messages.length > 50) state.messages.pop();
      if (onMessage) onMessage(msg);
    } catch {
      // ignore non-json lines
    }
  };

  eventSource.onerror = () => {
    state.connected = false;
    if (onMessage) onMessage({ from: 'gateway', payload: { event: 'connection.lost' } });
  };
}

export function disconnect() {
  if (eventSource) { eventSource.close(); eventSource = null; }
  state.connected = false;
}
