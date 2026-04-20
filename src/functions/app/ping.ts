import { Function } from "../../structures/Function";
import type { ChatInputCommandInteraction, Message } from "discord.js";

export default new Function({
  name: "ping",
  execute: (ctx: Message | ChatInputCommandInteraction) => {
    return ctx.client.ws.ping;
  },
});
