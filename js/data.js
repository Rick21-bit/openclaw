export const channels = [
  { id: 'whatsapp', name: 'WhatsApp', icon: 'W', color: '#22c55e' },
  { id: 'telegram', name: 'Telegram', icon: 'T', color: '#3b82f6' },
  { id: 'discord', name: 'Discord', icon: 'D', color: '#8b5cf6' },
  { id: 'slack', name: 'Slack', icon: 'S', color: '#ec4899' },
  { id: 'signal', name: 'Signal', icon: 'Si', color: '#f59e0b' }
];

export const conversations = [
  { id: 'mom-whatsapp', channel: 'whatsapp', name: 'Mom', avatar: 'M', last: 'Can you send me the trip photos?', time: '10:42 AM', unread: 2 },
  { id: 'hackernews-telegram', channel: 'telegram', name: 'Hacker News Group', avatar: 'HN', last: 'Agent: Summarized the top 5 posts.', time: '9:15 AM', unread: 0 },
  { id: 'team-discord', channel: 'discord', name: '#ai-agent-dev', avatar: '#', last: 'Bot: Deploy succeeded on pi.', time: 'Yesterday', unread: 5 },
  { id: 'work-slack', channel: 'slack', name: 'Engineering', avatar: 'En', last: 'Release is scheduled for Friday.', time: 'Yesterday', unread: 1 },
  { id: 'alice-signal', channel: 'signal', name: 'Alice', avatar: 'A', last: 'Let’s meet at 3 pm.', time: 'Tue', unread: 0 }
];

export const threadData = {
  'mom-whatsapp': [
    { sender: 'user', name: 'Mom', text: 'Can you send me the trip photos?', time: '10:40 AM' },
    { sender: 'agent', text: 'Of course. Searching your Photos memory now.', time: '10:41 AM', tool: 'memory.query("trip photos")' },
    { sender: 'agent', text: 'Found 12 recent photos from the trip. Sending them via WhatsApp now.', time: '10:42 AM' }
  ],
  'hackernews-telegram': [
    { sender: 'user', name: 'Alex', text: 'Catch me up on today’s top posts.', time: '9:05 AM' },
    { sender: 'agent', text: 'Pulling top stories from Hacker News.', time: '9:06 AM', tool: 'web_search("Hacker News top stories today")' },
    { sender: 'agent', text: 'Summarized the top 5 posts in the group description.', time: '9:15 AM' }
  ],
  'team-discord': [
    { sender: 'user', name: 'dev-sarah', text: 'deploy the latest build?', time: 'Yesterday' },
    { sender: 'agent', text: 'Kicking off deploy on home-server session.', time: 'Yesterday', tool: 'shell.run("cd ~/openclaw && ./deploy.sh")' },
    { sender: 'agent', text: 'Deploy succeeded on pi. Logs are in #ops-logs.', time: 'Yesterday' }
  ],
  'work-slack': [
    { sender: 'user', name: 'PM Jake', text: 'When is the release?', time: 'Yesterday' },
    { sender: 'agent', text: 'Checking Calendar and GitHub milestones.', time: 'Yesterday', tool: 'calendar.next_release, github.milestones' },
    { sender: 'agent', text: 'Release is scheduled for Friday per the v1.2 milestone.', time: 'Yesterday' }
  ],
  'alice-signal': [
    { sender: 'user', name: 'Alice', text: 'Let’s meet at 3 pm.', time: 'Tue' },
    { sender: 'agent', text: 'Noted. I’ll send a calendar invite and remind you 15 min before.', time: 'Tue', tool: 'calendar.create("coffee with Alice", 15:00)' }
  ]
};

export const sessions = [
  { id: 'desktop', label: 'Desktop Agent', workspace: '~/openclaw', channel: 'all', status: 'active' },
  { id: 'pi', label: 'Home Server', workspace: '/opt/openclaw', channel: 'telegram, signal', status: 'active' },
  { id: 'work', label: 'Work MacBook', workspace: '~/work/openclaw', channel: 'slack, discord', status: 'idle' }
];

export const skills = [
  { id: 'web-search', name: 'Web Search', icon: '🌐', desc: 'Search the public web and return summaries.', active: true },
  { id: 'gmail', name: 'Gmail', icon: '✉️', desc: 'Read, draft, and send email.', active: true },
  { id: 'calendar', name: 'Calendar', icon: '📅', desc: 'Create events and check availability.', active: true },
  { id: 'browser', name: 'Browser', icon: '🪟', desc: 'Control a local browser for deep research.', active: false },
  { id: 'obsidian', name: 'Obsidian', icon: '📝', desc: 'Read and update your Obsidian vault.', active: true },
  { id: 'github', name: 'GitHub', icon: '🐙', desc: 'Search repos, issues, and run workflows.', active: true },
  { id: 'spotify', name: 'Spotify', icon: '🎵', desc: 'Control playback and search tracks.', active: false },
  { id: 'photos', name: 'Photos', icon: '🖼️', desc: 'Search and share local photo libraries.', active: false },
  { id: 'slack', name: 'Slack', icon: '💬', desc: 'Post messages and query channels.', active: true },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'W', desc: 'Send and receive WhatsApp messages.', active: true },
  { id: 'telegram', name: 'Telegram', icon: 'T', desc: 'Send and receive Telegram messages.', active: true },
  { id: 'signal', name: 'Signal', icon: 'Si', desc: 'Send Signal messages and read groups.', active: false },
  { id: 'pingpon', name: 'PingPON Arcade', icon: '🏓', desc: 'Launch the neuro-evolution ping pong arcade.', active: true }
];

export const models = [
  'openai/gpt-4o-mini',
  'anthropic/claude-3-5-sonnet',
  'google/gemini-1.5-flash',
  'local/llama3.1',
  'local/qwen2.5'
];

export const defaultSettings = {
  agentOnline: true,
  model: 'openai/gpt-4o-mini',
  provider: 'openrouter',
  apiBase: 'http://localhost:11434/v1',
  apiKey: '',
  allowlist: '*',
  logLevel: 'info'
};
