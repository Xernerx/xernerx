/** @format */

import * as Discord from "discord.js";
import { z } from "zod";

import { start } from "../util/prompts.js";
import { XernerxStats } from "../types/interfaces.js";
import { CommandHandler } from "../handlers/CommandHandler.js";
import { XernerxMessageCommand } from "../builders/XernerxMessageCommand.js";
import { XernerxSlashCommand } from "../main.js";
import { XernerxContextCommand } from "../builders/XernerxContextCommand.js";
import { XernerxEvent } from "../builders/XernerxEvent.js";
import { XernerxInhibitor } from "../builders/XernerxInhibitor.js";
import XernerxLog from "../tools/XernerxLog.js";
import sharpyy from "sharpyy";
import { ClientUtil } from "../util/ClientUtil.js";

process.xernerx = {};

export class XernerxClient<T = {}> extends Discord.Client {
  public declare readonly settings;
  public declare readonly stats: XernerxStats;
  public declare readonly modules: {
    commandHandler: CommandHandler;
    options: {
      message?: { global?: boolean; prefix: Array<string> };
      slash?: { global?: boolean };
      context?: { global?: boolean };
    };
  };
  public declare readonly util: ClientUtil;
  public declare readonly commands;
  public declare readonly events;
  public declare readonly inhibitors;

  constructor(DiscordOptions: any, XernerxOptions: any, config: T) {
    super(DiscordOptions);

    this.settings = z
      .object({
        // required settings
        token: z.string(),

        // optional settings
        global: z.boolean().default(false),
        owners: z.array(z.string()).default([]),
        guilds: z.array(z.string()).default([]),

        // dev settings
        debug: z.boolean().default(false),
        log: z
          .object({
            type: z.enum(["static", "dynamic"]).default("static"),
            info: z.boolean().default(false),
            error: z.boolean().default(false),
            warn: z.boolean().default(false),
            debug: z.boolean().default(false),
          })
          .default({}),
      })
      .parse({ ...XernerxOptions, ...config });

    process.xernerx.log = this.settings.log;

    this.stats = {
      guilds: null,
      users: null,
      shardId: null,
      shardCount: null,
      shards: null,
      voteCount: null,
      votes: null,
      commands: {
        slash: {
          local: 0,
          global: 0,
        },
        message: {
          local: 0,
          global: 0,
        },
        context: {
          local: 0,
          global: 0,
        },
      },
    };

    this.util = new ClientUtil(this);

    start(this);

    this.modules = {
      commandHandler: new CommandHandler(this),

      options: {},
    };

    this.commands = {
      message: new Discord.Collection() as Discord.Collection<
        string,
        XernerxMessageCommand
      >,
      slash: new Discord.Collection() as Discord.Collection<
        string,
        XernerxSlashCommand
      >,
      context: new Discord.Collection() as Discord.Collection<
        string,
        XernerxContextCommand
      >,
    };

    this.events = new Discord.Collection() as Discord.Collection<
      string,
      XernerxEvent
    >;
    this.inhibitors = new Discord.Collection() as Discord.Collection<
      string,
      XernerxInhibitor
    >;

    this.connect();
  }

  private async connect() {
    // slash cmds
    this.deploy();

    // login
    this.login(this.settings.token);
  }

  private async deploy() {
    this.once("ready", async (client) => {
      const commands: {
        local: Array<XernerxSlashCommand | XernerxContextCommand>;
        global: Array<XernerxSlashCommand | XernerxContextCommand>;
      } = { local: [], global: [] };

      if (this.settings.global) {
        if (!this.modules.options.slash?.global)
          commands.global.push(...(this.commands.slash as any));
        else {
          commands.global.push(
            ...(this.commands.slash.filter((c) => c.global) as any),
          );

          commands.local.push(
            ...(this.commands.slash.filter((c) => !c.global) as any),
          );
        }

        if (!this.modules.options.context?.global)
          commands.global.push(...(this.commands.context as any));
        else {
          commands.global.push(
            ...(this.commands.context.filter((c) => c.global) as any),
          );

          commands.local.push(
            ...(this.commands.context.filter((c) => !c.global) as any),
          );
        }
      } else
        commands.local.push(
          ...(this.commands.context as any),
          ...(this.commands.slash as any),
        );

      for (const id of this.settings.guilds) {
        const guild = await this.guilds.fetch(id);

        if (!commands.local.length) break;

        if (this.settings.debug)
          XernerxLog.debug(
            `Attempting to deploy commands to guild: ${sharpyy(guild.name, "txBlue")}`,
          );

        this.rest.put(
          Discord.Routes.applicationGuildCommands(client.user.id, id),
          {
            body: (commands.local as any).map(([id, command]: any) =>
              command.toJSON(),
            ),
          },
        );

        await XernerxLog.box(
          (commands.local as any)
            .map(([id]: [string]) => sharpyy(id, "txYellow"))
            .join(", "),
          "red",
          `Deployed ${sharpyy("local", "txRed", "bold")} commands in ${sharpyy(guild.name, "txBlue")}`,
        );
      }

      if (this.settings.global) {
        if (this.settings.debug)
          XernerxLog.debug(`Attempting to deploy commands globally`);

        this.rest.put(Discord.Routes.applicationCommands(client.user.id), {
          body: [],
        });

        await XernerxLog.box(
          (commands.global as any)
            .map(([id]: [string]) => sharpyy(id, "txYellow"))
            .join(", "),
          "green",
          `Deployed ${sharpyy("global", "txGreen", "bold")} commands`,
        );
      }
    });
  }
}
