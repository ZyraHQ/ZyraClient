import { Function } from "@/structures/Function";
import { Message, type ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "username",
  args: [
    {
      name: "id",
      type: "string",
      optional: true,
    },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction) => {
    return ctx instanceof Message ? ctx.author.username : ctx.user.username;
  },
});
