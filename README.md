# ⚡ ZyraClient

> Build Discord bots faster, cleaner, and smarter.

---

# 🧭 About

**ZyraClient** is a modern abstraction layer built on top of discord.js, designed to eliminate friction in Discord bot development.

It provides a clean architecture, expressive APIs, and a scalable foundation — allowing you to focus on features instead of repetitive setup and structural overhead.

Whether you're building a small utility bot or a large-scale system, ZyraClient is engineered to keep your codebase organized, maintainable, and extensible.

---

✨ Highlights

- ⚡ Rapid setup — minimal configuration to get started
- 🧩 Unified command system — prefix & slash support
- 🧠 Abstraction over discord.js — less boilerplate, more logic
- 🏗️ Modular architecture — built for scalability
- 🔒 Safe patterns by design — cleaner and more predictable code
- 🚀 Actively evolving — new features and improvements planned

---

# 📦 Installation

```bash
npm install zyraclient
```

---

# ⚡ Quick Example

```js
import ZyraClient from "zyraclient";

const client = new ZyraClient({
  token: process.env.TOKEN,
  prefix: "z+",
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.setStatus([
  {
    type: "Playing",
    name: "🍇 ZyraClient",
  },
]);

client.addPrefixCommand({
  name: "ping",
  description: "Check bot latency",
  code: `
  🏓 Pong! WebSocket: **$ping ms**
  `,
});

client.addSlashCommand({
  name: "say",
  description: "Make the bot say something",
  type: "ChatInput",
  options: [
    {
      name: "message",
      description: "Message to send",
      type: "String",
      required: true,
    },
  ],
  code: `
  💬 **$userDisplayName**: $option[message]
  `,
});

await client.start();
```

---

# 🧠 Design Principles

**ZyraClient is built around a strong set of engineering principles:**

- Clarity over complexity
- Convention over configuration
- Scalability from day one
- Developer experience as a priority

It avoids unnecessary abstractions while still providing powerful tools to accelerate development.

---

# 🧩 Architecture

ZyraClient promotes a modular structure, encouraging separation of concerns and long-term maintainability.

It does not enforce rigid patterns — instead, it gives you a flexible foundation that adapts to your workflow while maintaining consistency across your project.

---

# ⚙️ Configuration

```json
{
  token: "Your bot token",
  prefix: "Command prefix",
  intents: ["Gateway intents"]
}```

---

# 📁 Suggested Structure

```file
src/
 ├── commands/
 ├── events/
 └── index.js
```
---

# 🧪 Best Practices

- 🔐 Use environment variables for sensitive data
- 🧩 Keep features modular
- 🚫 Avoid hardcoded values
- 📈 Design with scalability in mind

---

# 🤝 Contributing

Contributions are welcome and encouraged.

- Fork the repository
- Create a new branch
- Submit your improvements via Pull Request

---

# ⭐ Support

If ZyraClient helps you, consider giving the project a star it helps the ecosystem grow.

---

# 📄 License

MIT License

---

# 💭 Final Note

ZyraClient is built to remove friction, increase productivity, and scale with your ideas.

Less setup. More building.