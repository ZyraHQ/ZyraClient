import { Function } from "../../structures/Function";
import { ChatInputCommandInteraction, Message } from "discord.js";

export default new Function({
  name: "authorID",
  execute: (ctx: Message | ChatInputCommandInteraction) => {
    if (ctx instanceof Message) {
      return ctx.author.id;
    } else {
      return ctx.user.id;
    }
  },
});
