import ZyraClient from "../index";

const client = new ZyraClient({
  token: process.env["TOKEN"]!, // keep it safe 👀
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
  $color[Random;1]
  $description[🚀 ZyraClient makes it easy.;2]
  $color[Random;2]
  $addButton[btn1;Click;primary]
  `,
});

client.addPrefixCommand({
  name: "avatar",
  description: "Get your avatar URL",
  code: `
  🖼️ Your avatar: $hyperLink[$userDisplayName;$userAvatar[$authorID]]
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
