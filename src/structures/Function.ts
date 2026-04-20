import chalk from "chalk";
import { z } from "zod";
import type { Message, ChatInputCommandInteraction } from "discord.js";
import { consola } from "consola";

export const FunctionArgSchema = z.object({
  name: z.string().min(1, "Arg name is required"),
  type: z.enum([
    "string",
    "number",
    "boolean",
    "user",
    "member",
    "channel",
    "role",
  ]),
  optional: z.boolean().optional().default(false),
});

export type EmbedPayload = {
  __embed?: Record<string, unknown>;
  __embedField?: { name: string; value: string; inline?: boolean };
  __embedIndex?: number;
  __reply?: boolean;
  __mentionReply?: boolean;
  allowedMentions?: Record<string, unknown>;
  content?: string;
};

export type ComponentPayload = {
  __button?: {
    customId: string;
    label: string;
    style: string;
    emoji?: string;
    disabled?: boolean;
  };
  __actionRow?: boolean;
};

export type FunctionReturn =
  | string
  | number
  | boolean
  | EmbedPayload
  | ComponentPayload
  | URL
  | { __error: string };

export const FunctionOptionsSchema = z.object({
  name: z.string().min(1, "Function name is required"),
  args: z.array(FunctionArgSchema).optional(),
  execute:
    z.custom<
      (
        ctx: Message | ChatInputCommandInteraction,
        args?: Record<string, string>,
      ) => FunctionReturn | Promise<FunctionReturn>
    >(),
});

export type FunctionOptionsType = z.infer<typeof FunctionOptionsSchema>;
export type FunctionArgType = z.infer<typeof FunctionArgSchema>;

export class Function {
  public name: string;
  public args?: FunctionOptionsType["args"];
  public execute: FunctionOptionsType["execute"];

  constructor(options: FunctionOptionsType) {
    const validatedOptions = FunctionOptionsSchema.safeParse(options);

    if (!validatedOptions.success) {
      consola.error(chalk.bold.red("Invalid Function Options:"));

      validatedOptions.error.issues.forEach((err) => {
        const path = err.path.join(".");
        consola.error(chalk.red(`- ${path}: ${err.message}`));
      });

      process.exit(1);
    }

    this.name = validatedOptions.data.name;
    this.args = validatedOptions.data.args;
    this.execute = validatedOptions.data.execute;
  }
}
