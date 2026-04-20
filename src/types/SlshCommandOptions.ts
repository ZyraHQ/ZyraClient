import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import z from "zod";

export const SlashTypes = {
  ChatInput: ApplicationCommandType.ChatInput,
  User: ApplicationCommandType.User,
  Message: ApplicationCommandType.Message,
} as const;

export const SlashOptionTypes = {
  String: ApplicationCommandOptionType.String,
  Integer: ApplicationCommandOptionType.Integer,
  Boolean: ApplicationCommandOptionType.Boolean,
  User: ApplicationCommandOptionType.User,
  Channel: ApplicationCommandOptionType.Channel,
  Role: ApplicationCommandOptionType.Role,
  Number: ApplicationCommandOptionType.Number,
  Mentionable: ApplicationCommandOptionType.Mentionable,
  Attachment: ApplicationCommandOptionType.Attachment,
  SubCommand: ApplicationCommandOptionType.Subcommand,
  SubCommandGroup: ApplicationCommandOptionType.SubcommandGroup,
} as const;

const slashTypeKeys = Object.keys(SlashTypes) as [string, ...string[]];
const slashOptionTypeKeys = Object.keys(SlashOptionTypes) as [
  string,
  ...string[],
];

const localizationsSchema = z
  .record(z.string(), z.string().max(100))
  .optional();

export const SlashOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  nameLocalizations: localizationsSchema,
  description: z.string().min(1, "Option description is required"),
  descriptionLocalizations: localizationsSchema,
  type: z.enum(slashOptionTypeKeys).default("String"),
  required: z.boolean().optional().default(false),
  choices: z
    .array(
      z.object({
        name: z.string(),
        value: z.union([z.string(), z.number()]),
      }),
    )
    .optional(),
});

export const SlashCommandSchema = z.object({
  name: z.string().min(1, "Command name is required"),
  nameLocalizations: localizationsSchema,
  description: z.string().min(1, "Command description is required"),
  descriptionLocalizations: localizationsSchema,
  type: z.enum(slashTypeKeys).default("ChatInput"),
  options: z.array(SlashOptionSchema).optional(),
  code: z.string().min(1, "Command code is required"),
});

export type SlashOptionType = z.infer<typeof SlashOptionSchema>;
export type SlashCommandType = z.infer<typeof SlashCommandSchema>;
