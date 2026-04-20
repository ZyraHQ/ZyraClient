import { Function } from "../../structures/Function";
import type { ChatInputCommandInteraction, Message } from "discord.js";

export default new Function({
  name: "addButton",
  args: [
    { name: "customID", type: "string", optional: false },
    { name: "label", type: "string", optional: false },
    { name: "style", type: "string", optional: false },
    { name: "emoji", type: "string", optional: true },
    { name: "disabled", type: "boolean", optional: true },
  ],
  execute: (ctx: Message | ChatInputCommandInteraction, args) => {
    if (!args?.customID || !args?.label || !args?.style) return "";

    if (args.customID.length > 100) {
      return { __error: `Button custom ID cannot exceed **100** characters.` };
    }

    if (args.label.length > 80) {
      return { __error: `Button label cannot exceed **80** characters.` };
    }

    const validStyles = {
      primary: "Primary",
      secondary: "Secondary",
      success: "Success",
      danger: "Danger",
      link: "Link",
    };

    const styleKey = args.style.toLowerCase();
    if (!validStyles[styleKey as keyof typeof validStyles]) {
      return {
        __error: `Invalid button style "**${args.style}**". Valid styles are: ${Object.keys(validStyles).join(", ")}.`,
      };
    }

    return {
      __button: {
        customId: args.customID,
        label: args.label,
        style: validStyles[styleKey as keyof typeof validStyles],
        emoji: args.emoji || undefined,
        disabled: args.disabled === "true",
      },
    };
  },
});
