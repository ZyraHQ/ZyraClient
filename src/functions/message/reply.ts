import { Function } from "../../structures/Function";
import type { Message, ChatInputCommandInteraction } from "discord.js";

export default new Function({
  name: "reply",
  args: [
    { name: "content", type: "string", optional: true },
    { name: "embed", type: "string", optional: true },
    { name: "mentionReply", type: "boolean", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    const mentionReply = args?.mentionReply !== "false";

    return {
      __reply: true,
      __mentionReply: mentionReply,
      content: "",
    } as any;
  },
});
