import { Function } from "@/structures/Function";
import type { ChatInputCommandInteraction, Message } from "discord.js";

export default new Function({
  name: "addActionRow",
  args: [],
  execute: (ctx: Message | ChatInputCommandInteraction) => {
    return { __actionRow: true };
  },
});
