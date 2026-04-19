import App from "@/index";

const client = new App({
  token:
    "MTMxNTA5OTQ0NzkwNjI3NTQwOA.G_TCiy.NN69eAGU65aN6af0xgU1A9kQMnyxoFwE8OVpmY",
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  prefix: "z+",
});

client.addStatus([{ type: "Playing", name: "🍇 - ZyraClient" }]);

client.addPrefixCommand({
  name: "ping",
  description: "ver ping",
  code: `> WebSocket: $ping`,
});

client.addPrefixCommand({
  name: "embed",
  description: "criar um embed simples",
  code: `
  $reply[;;false]
  $description[Este é um embed de teste!;1]
  $description[Este é o segundo campo do embed!;2]`,
});

client.addSlashCommand({
  name: "say",
  nameLocalizations: {
    "pt-BR": "falar",
  },
  description: "make the bot say something",
  descriptionLocalizations: {
    "pt-BR": "fazer o bot falar algo",
  },
  type: "ChatInput",
  options: [
    {
      name: "message",
      description: "the message to say",
      type: "String",
      required: true,
    },
  ],
  code: `
  $reply[;;true]
  $userDisplayName/$memberDisplayName mandou eu falar: $option[message]`,
});

await client.start();
