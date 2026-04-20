# ⚡ ZyraClient

> A modern, powerful, and developer-friendly library for building Discord bots with speed and scalability.

## ✨ Overview

**ZyraClient** is built for developers who want to create Discord bots without friction.  
It provides a clean architecture, intuitive APIs, and the flexibility to scale from simple bots to advanced systems.

Built on top of discord.js, **ZyraClient** delivers a simpler, more organized, and productive development experience — without sacrificing performance or control.

Build smarter. Ship faster. 🚀

---

## 🚀 Features

- ⚡ Fast setup  
- 🧩 Prefix & Slash command system
- 🔒 Secure by design  
- 🧠 Powered by discord.js  
- 🚧 Event system (coming soon)

---

## 📦 Installation

```bash
npm install zyraclient
```

---

## ⚡ Example Usage

```js
import ZyraClient from "zyraclient";

const client = new ZyraClient({
  token: process.env["TOKEN"], // keep it safe 👀
  prefix: "z+",
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

// Bot Status
client.setStatus([
  {
    type: "Playing",
    name: "🍇 ZyraClient",
  },
]);

// Prefix Commands
client.addPrefixCommand({
  name: "ping",
  description: "Check bot latency",
  code: `
  🏓 Pong! WebSocket: **$ping ms**
  `,
});

client.addPrefixCommand({
  name: "embed",
  description: "Send a simple embed",
  code: `
  $description[✨ This is a test embed!;1]
  $description[🚀 ZyraClient makes it easy.;2]
  `,
});

// Slash Commands
client.addSlashCommand({
  name: "say",
  description: "Make the bot say something",
  nameLocalizations: {
    "pt-BR": "falar",
  },
  descriptionLocalizations: {
    "pt-BR": "Fazer o bot falar algo",
  },
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

// Start the bot
await client.start();
```

---

## 🧠 Core Concepts

### Commands

```js
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
```

Supports both prefix and slash commands.

---

## ⚙️ Configuration

```
token    → Discord bot token  
prefix   → Command prefix  
intents  → Gateway intents
```

---

## 📁 Suggested Structure

```
/src  
  /commands  
  index.js
```

---

## 🧪 Best Practices

- Use .env for sensitive data  
- Keep commands modular  
- Avoid hardcoding values  
- Structure your bot for scalability  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Open a Pull Request  

---

## ⭐ Support

If you like this project, consider giving it a star ⭐  

---

## 📄 License

MIT License  

---

## 💭 Final Thoughts

ZyraClient is focused on delivering a smooth and efficient developer experience for Discord bot development.

More features are on the way — stay tuned.
