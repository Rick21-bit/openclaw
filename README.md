# OpenClaw

OpenClaw is a self-hosted multi-channel gateway for personal AI agents.
It bridges chat apps — WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and more — to a local agent with memory, skills, sessions, and a Web Control UI.
The gateway runs on your machine; you chat from anywhere.

## Web Control UI

The included static demo (`index.html`) shows the OpenClaw dashboard:

- **Chat** — conversations across all connected channels with agent replies and tool traces.
- **Sessions** — active agent runtimes and workspaces.
- **Channels** — toggle connections and mention rules.
- **Skills / ClawHub** — enable or disable tools like Web Search, Gmail, Calendar, Browser, Obsidian, GitHub, Spotify, and more.
- **Memory** — persistent, editable facts stored in `localStorage`.
- **Settings** — model/provider selector, API base URL/key, allowlist, and log level.

All settings, skill toggles, channel states, and memory entries persist in the browser with `localStorage`.

## Run locally

```bash
npm install
npm start
# or
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Run smoke tests

```bash
npm test
```

The smoke test verifies that `index.html`, `style.css`, `app.js`, and helpers under `js/` are present.

## Project layout

```
index.html      # Dashboard shell
style.css       # Single dark-themed stylesheet
app.js          # ES module app router and renderers
js/data.js      # Dummy channel/conversation/skill data
js/storage.js   # localStorage helpers
js/ui.js        # DOM helpers and toast notifications
tests/smoke.js  # File-existence smoke test
```

## License

MIT
