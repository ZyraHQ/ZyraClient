import type { Interaction } from "discord.js";
import type { App } from "../structures/App";

export default async (client: App, interaction: Interaction): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  await command.execute(interaction);
};
