import type { Message } from "discord.js";
import type { App } from "@/structures/App";

export default async (client: App, message: Message): Promise<void> => {
  if (message.author.bot) return;
  if (!client.prefix) return;

  const prefixes = Array.isArray(client.prefix)
    ? client.prefix
    : [client.prefix];
  const prefix = prefixes.find((p) => message.content.startsWith(p));

  if (!prefix) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  await command.execute(message, args);
};
