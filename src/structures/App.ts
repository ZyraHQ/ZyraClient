import { Client, Collection } from "discord.js";
import { IntentsOptions } from "@/types/IntentsOptions";
import { AppOptionsSchema, type AppOptions } from "@/types/AppOptions";
import consola from "consola";
import chalk from "chalk";
import {
  StatusOptionsSchema,
  StatusTypes,
  type StatusOptionsType,
} from "@/types/StatusOptions";
import { PrefixCommand } from "./PrefixCommand";
import { loadListeners } from "@/utils/loadListeners";
import { SlashCommand } from "./SlashCommand";
import type { PrefixCommandType } from "@/types/PrefixCommandOptions";
import type { SlashCommandType } from "@/types/SlshCommandOptions";

export class App extends Client {
  public prefix?: string | string[];
  public prefixCommands: Collection<string, PrefixCommand> = new Collection();
  public slashCommands: Collection<string, SlashCommand> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  private _token: string;

  constructor(options: AppOptions) {
    const validatedOptions = AppOptionsSchema.safeParse(options);

    if (!validatedOptions.success) {
      consola.error(chalk.bold.red("Invalid App options:"));

      validatedOptions.error.issues.forEach((err) => {
        const path = err.path.join(".");
        consola.error(chalk.red(`- ${path}: ${err.message}`));
      });

      process.exit(1);
    }

    super({
      intents: validatedOptions.data.intents.map(
        (intent) => IntentsOptions[intent as keyof typeof IntentsOptions],
      ),
    });

    this.prefix = options.prefix;
    this._token = options.token;
  }

  private async registerSlashCommands() {
    const commands = [];

    for (const cmd of this.slashCommands.values()) {
      commands.push(cmd);
    }

    if (!commands.length) return;

    await this.application?.commands.set(commands as any);

    consola.success(
      `${chalk.magenta(commands.length)} slash command(s) registrado(s)!`,
    );
  }

  public async start() {
    try {
      await loadListeners(this);
      await this.login(this._token);
      await this.registerSlashCommands();
      consola.success(
        chalk.bold.green(
          `App ${chalk.magenta(this.user?.tag ?? "Unknown")} is now online!`,
        ),
      );
    } catch (error) {
      consola.error(chalk.bold.red("Failed to start App:"));
      consola.error(
        chalk.red(error instanceof Error ? error.message : String(error)),
      );
      process.exit(1);
    }
  }

  public setStatus(status: StatusOptionsType | StatusOptionsType[]): this {
    const list = Array.isArray(status) ? status : [status];

    for (const s of list) {
      const validatedStatus = StatusOptionsSchema.safeParse(s);

      if (!validatedStatus.success) {
        consola.error(chalk.bold.red("Invalid status options:\n"));

        validatedStatus.error.issues.forEach((err) => {
          const path = err.path.join(".");
          consola.error(chalk.red(`- ${path}: ${err.message}`));
        });

        return this;
      }
    }

    let index = 0;

    const updateStatus = () => {
      const current = list[index];
      this.user?.setPresence({
        status: current?.status ?? "online",
        activities: [
          {
            name: current!.name,
            type: StatusTypes[current?.type as keyof typeof StatusTypes],
            url: current?.url,
          },
        ],
      });
      index = (index + 1) % list.length;

      if (list.length > 1) {
        setTimeout(updateStatus, current?.interval ?? 15e3);
      }
    };

    if (this.isReady()) {
      updateStatus();
    } else {
      this.once("clientReady", updateStatus);
    }

    return this;
  }

  public addPrefixCommand(options: PrefixCommandType) {
    const command = new PrefixCommand(options);

    this.prefixCommands.set(command.name, command);

    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.prefixCommands.set(alias, command);
      });
    }

    return this;
  }

  public addSlashCommand(options: SlashCommandType) {
    const command = new SlashCommand(options);
    this.slashCommands.set(command.name, command);
    return this;
  }
}
