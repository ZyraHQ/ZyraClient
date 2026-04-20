import type {
  Message,
  ChatInputCommandInteraction,
  MessageMentionOptions,
  InteractionReplyOptions,
} from "discord.js";
import type { Function } from "../structures/Function";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const variables: Record<string, Function> = {};

const loadFunctions = async () => {
  const dir = join(import.meta.dirname, "./functions");

  for (const folder of readdirSync(dir)) {
    const folderPath = join(dir, folder);
    if (!statSync(folderPath).isDirectory()) continue;

    for (const file of readdirSync(folderPath)) {
      if (!file.endsWith(".ts")) continue;

      const filePath = join(folderPath, file);
      const mod = await import(filePath);

      if (mod.default) {
        variables[mod.default.name] = mod.default;
      }
    }
  }
};

await loadFunctions();

const normalize = (text: string) => text.replace(/\r\n/g, "\n");

const getLocation = (text: string, index: number) => {
  let line = 1;
  let col = 1;

  for (let i = 0; i < index; i++) {
    if (text[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }

  return { line, col };
};

const formatError = (
  fnName: string,
  argName: string,
  line: number,
  col: number,
): string => {
  return `**ZyraClient**: I detected an error while using the function "**$${fnName}**"\n> Missing required argument "**${argName}**" in **$${fnName}**. (line ${line}, colun ${col})`;
};

const formatCustomError = (
  fnName: string,
  message: string,
  line: number,
  col: number,
): string => {
  return `**ZyraClient**: I detected an error while using the function "**$${fnName}**"\n> ${message} in **$${fnName}**. (line ${line}, colun ${col})`;
};

const parseArgs = (
  raw: string,
  fn: Function,
): Record<string, string> | undefined => {
  if (!fn.args?.length) return undefined;

  const values = raw.split(";").map((v) => v.trim());
  const result: Record<string, string> = {};

  fn.args.forEach((arg, i) => {
    const value = values[i];
    if (value !== undefined) {
      result[arg.name] = value;
    }
  });

  return Object.keys(result).length > 0 ? result : undefined;
};

const validateArgs = (
  raw: string,
  fn: Function,
  template: string,
  index: number,
): string | null => {
  if (!fn.args?.length) return null;

  const values = raw.split(";").map((v) => v.trim());
  const { line, col } = getLocation(template, index);

  for (let i = 0; i < fn.args.length; i++) {
    const arg = fn.args[i];
    if (!arg) continue;

    const value = values[i];

    if (!arg.optional && (!value || value === "")) {
      return formatError(fn.name, arg.name, line, col);
    }
  }

  return null;
};

const RESERVED = new Set<string>();

export interface EmbedData {
  title?: string;
  description?: string;
  color?: number;
  footer?: { text: string; iconURL?: string };
  image?: string;
  thumbnail?: string;
  author?: { name: string; iconURL?: string; url?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
  url?: string;
  timestamp?: boolean;
}

export interface ButtonData {
  customId: string;
  label: string;
  style: string;
  emoji?: string;
  disabled?: boolean;
}

export interface ActionRowData {
  buttonIndices: number[];
}

export interface ParsedResult {
  content: string;
  reply: boolean;
  allowedMentions?:
    | MessageMentionOptions
    | InteractionReplyOptions["allowedMentions"];
  embeds?: Record<number, EmbedData>;
  buttons?: Record<number, ButtonData>;
  actionRows?: ActionRowData[];
}

type Node =
  | { type: "text"; value: string }
  | { type: "flag"; name: string }
  | {
      type: "call";
      name: string;
      args: Node[];
      index: number;
      hasBrackets: boolean;
    };

const isNameChar = (char: string | undefined): char is string =>
  typeof char === "string" && /[a-zA-Z0-9_]/.test(char);

const parse = (input: string): Node[] => {
  const nodes: Node[] = [];
  let i = 0;

  while (i < input.length) {
    const current = input[i];

    if (current === "$") {
      const start = i;
      i++;

      let name = "";
      while (isNameChar(input[i])) {
        name += input[i];
        i++;
      }

      if (RESERVED.has(name)) {
        nodes.push({ type: "flag", name });
        continue;
      }

      if (input[i] === "[") {
        i++;

        let depth = 1;
        const argStart = i;

        while (i < input.length && depth > 0) {
          const char = input[i];
          if (char === "[") depth++;
          else if (char === "]") depth--;
          i++;
        }

        const rawArgs = input.slice(argStart, i - 1);

        nodes.push({
          type: "call",
          name,
          args: parse(rawArgs),
          index: start,
          hasBrackets: true,
        });
      } else {
        nodes.push({
          type: "call",
          name,
          args: [],
          index: start,
          hasBrackets: false,
        });
      }
    } else {
      let text = "";
      while (i < input.length && input[i] !== "$") {
        text += input[i] ?? "";
        i++;
      }
      nodes.push({ type: "text", value: text });
    }
  }

  return nodes;
};

const toText = (v: unknown): string =>
  typeof v === "string" || typeof v === "number"
    ? String(v)
    : v && typeof v === "object" && "content" in v
      ? String((v as any).content ?? "")
      : "";

const executeNodes = async (
  nodes: Node[],
  ctx: Message | ChatInputCommandInteraction,
  template: string,
): Promise<ParsedResult> => {
  let content = "";
  let allowedMentions:
    | MessageMentionOptions
    | InteractionReplyOptions["allowedMentions"]
    | undefined;
  let shouldReply = false;
  let mentionReply = true;
  let embeds: Record<number, EmbedData> = {};
  let buttons: Record<number, ButtonData> = {};
  let buttonBuffer: number[] = [];
  let actionRows: ActionRowData[] = [];

  for (const node of nodes) {
    if (node.type === "text") {
      content += node.value;
      continue;
    }

    if (node.type === "flag") continue;

    const fn = variables[node.name];
    if (!fn) continue;

    const resolvedArgs = await executeNodes(node.args, ctx, template);

    const error = validateArgs(resolvedArgs.content, fn, template, node.index);
    if (error) return { content: error, reply: true };

    if (!node.hasBrackets) {
      const req = fn.args?.find((a) => !a.optional);
      if (req) {
        const { line, col } = getLocation(template, node.index);
        return {
          content: formatError(node.name, req.name, line, col),
          reply: true,
        };
      }
    }

    const fnArgs = parseArgs(resolvedArgs.content, fn);

    try {
      const value = await fn.execute(ctx, fnArgs);

      if (value && typeof value === "object") {
        const v = value as any;

        allowedMentions ??= v.allowedMentions;

        if (v.__reply) {
          shouldReply = true;
          mentionReply = v.__mentionReply ?? true;
        }

        if (v.__error) {
          const { line, col } = getLocation(template, node.index);
          return {
            content: formatCustomError(node.name, v.__error, line, col),
            reply: true,
          };
        }

        if (v.__embed) {
          const embedIndex: number = v.__embedIndex ?? 1;
          const { line, col } = getLocation(template, node.index);

          if (embedIndex < 1 || embedIndex > 10) {
            return {
              content: formatCustomError(
                node.name,
                `Embed index must be between **1** and **10**`,
                line,
                col,
              ),
              reply: true,
            };
          }

          embeds[embedIndex] ??= {};
          Object.assign(embeds[embedIndex], v.__embed);
        }

        if (v.__embedField) {
          const embedIndex: number = v.__embedIndex ?? 1;
          const { line, col } = getLocation(template, node.index);

          if (embedIndex < 1 || embedIndex > 10) {
            return {
              content: formatCustomError(
                node.name,
                `Embed index must be between **1** and **10**`,
                line,
                col,
              ),
              reply: true,
            };
          }

          embeds[embedIndex] ??= {};
          embeds[embedIndex]!.fields ??= [];
          embeds[embedIndex]!.fields!.push(v.__embedField);
        }

        if (v.__button) {
          const buttonIndex = Object.keys(buttons).length + 1;

          buttons[buttonIndex] = v.__button;
          buttonBuffer.push(buttonIndex);

          if (buttonBuffer.length > 5) {
            const { line, col } = getLocation(template, node.index);
            return {
              content: formatCustomError(
                "addActionRow",
                "Action row limit reached (**5 buttons max**). Use $addActionRow to start a new row.",
                line,
                col,
              ),
              reply: true,
            };
          }
        }

        if (v.__actionRow) {
          if (buttonBuffer.length === 0) {
            const { line, col } = getLocation(template, node.index);
            return {
              content: formatCustomError(
                node.name,
                "Cannot create an empty action row. Add at least one button before using $addActionRow.",
                line,
                col,
              ),
              reply: true,
            };
          }

          actionRows.push({
            buttonIndices: [...buttonBuffer],
          });

          buttonBuffer = [];

          if (actionRows.length > 5) {
            const { line, col } = getLocation(template, node.index);
            return {
              content: formatCustomError(
                node.name,
                "Action row limit reached (**5 max per message**).",
                line,
                col,
              ),
              reply: true,
            };
          }
        }
      } else {
        content += toText(value);
      }
    } catch {
      const { line, col } = getLocation(template, node.index);
      return {
        content: formatCustomError(
          node.name,
          `An unexpected error occurred`,
          line,
          col,
        ),
        reply: true,
      };
    }
  }

  if (buttonBuffer.length > 0) {
    actionRows.push({
      buttonIndices: [...buttonBuffer],
    });
  }

  return {
    content: content.trim(),
    allowedMentions: { ...allowedMentions, repliedUser: mentionReply },
    reply: shouldReply,
    embeds: Object.keys(embeds).length ? embeds : undefined,
    buttons: Object.keys(buttons).length ? buttons : undefined,
    actionRows: actionRows.length ? actionRows : undefined,
  };
};

export const parseMessage = async (
  template: string,
  ctx: Message | ChatInputCommandInteraction,
): Promise<ParsedResult> => {
  const normalized = normalize(template);
  const ast = parse(normalized);

  return executeNodes(ast, ctx, normalized);
};
