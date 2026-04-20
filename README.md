# ⚡ ZyraClient

>>> A modern, scalable, and developer-focused library for building Discord bots with clarity and efficiency.»

---

# ✨ Overview

**ZyraClient** is designed to streamline Discord bot development by reducing unnecessary complexity and enforcing a clean, scalable architecture.

Built on top of **discord.js**, it provides a higher-level abstraction that allows developers to focus on building features instead of managing low-level implementation details.

The goal is simple: deliver a faster, cleaner, and more maintainable development experience without sacrificing flexibility or performance.

---

🎯 Philosophy

ZyraClient is built around a few core principles:

- Simplicity over verbosity — minimize boilerplate and cognitive overhead
- Scalability by design — support both small projects and large systems
- Developer experience first — intuitive structure and predictable behavior
- Flexibility without lock-in — extend and customize when needed

---

🚀 Features

- ⚡ Streamlined development workflow
- 🧩 Unified command architecture (prefix & slash ready)
- 🧠 Abstracted layer over discord.js
- 🏗️ Modular and scalable structure
- 🔒 Designed with safe patterns in mind
- 🚧 Continuous evolution with new features planned

---

📦 Installation

npm install zyraclient

---

⚡ Example Usage

import ZyraClient from "zyraclient";

const client = new ZyraClient({
  token: process.env.TOKEN,
  prefix: "z+",
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

// Bot status
client.setStatus([
  {
    type: "Playing",
    name: "🍇 ZyraClient",
  },
]);

// Prefix command
client.addPrefixCommand({
  name: "ping",
  description: "Check bot latency",
  code: `
  🏓 Pong! WebSocket: **$ping ms**
  `,
});

// Slash command
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

// Start bot
await client.start();

---

🧠 Core Concepts

Commands

client.addPrefixCommand({
  name: "hello",
  code: `Hello $username 👋`,
});

client.addSlashCommand({
  name: "hello",
  description: "Say hello",
  type: "ChatInput",
  code: `Hello $userDisplayName 👋`,
});

ZyraClient provides a unified way to define both prefix and slash commands while keeping the syntax clean and expressive.

---

⚙️ Configuration

{
  token: "Your bot token",
  prefix: "Command prefix",
  intents: ["Gateway intents"]
}

---

📁 Suggested Structure

src/
 ├── commands/
 ├── events/
 └── index.js

---

🧪 Best Practices

- Use environment variables for sensitive data
- Keep commands modular
- Avoid hardcoded values
- Structure your project for scalability

---

🤝 Contributing

Contributions are welcome. Whether it's improving the core, suggesting new ideas, or refining the developer experience, every contribution helps shape the project.

---

⭐ Support

If you find ZyraClient useful, consider supporting the project and helping it grow.

---

📄 License

MIT License

---

💭 Final Thoughts

ZyraClient is built to remove friction from Discord bot development — giving you the tools to build faster, structure better, and scale with confidence.