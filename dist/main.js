import * as Discord from 'discord.js';
import { z } from 'zod';
import sharpyy2, { link } from 'sharpyy';
import * as fs from 'fs';
import * as path from 'path';
import path__default from 'path';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var XernerxLog_default = new class XernerxLog {
  static {
    __name(this, "XernerxLog");
  }
  constructor() {
    this.baseText = `${sharpyy2("XERNERX", "txRainbow", "bold")} | ${(/* @__PURE__ */ new Date()).toLocaleTimeString().split(/ /gim).map(
      (str) => str.split(":").map((str2) => isNaN(Number(str2)) ? str2 : sharpyy2(str2, "txCyan")).join(":")
    ).join(" ")} | ${sharpyy2(String(Math.round(process.memoryUsage().rss / 1e4) / 100), "txCyan")}mb |`;
  }
  info(message) {
    return console.info(`\u2714\uFE0F  |`, this.baseText, message);
  }
  async error(message, error) {
    const { default: boxen } = await import('boxen');
    const errorMessage = boxen(error?.stack, { padding: 1, margin: 1, borderStyle: "round", borderColor: "red" });
    if (error) return console.error(`\u2757 |`, this.baseText, message, errorMessage);
    else return console.error(`\u2757 |`, this.baseText, message);
  }
  warn(message, url) {
    console.warn(`\u26A0\uFE0F  |`, this.baseText, message, url ? `Read more here ${link("here", url)}` : "");
  }
  debug(message) {
    return console.debug(`\u{1F41B} |`, this.baseText, message);
  }
  async box(message, color, title) {
    const { default: boxen } = await import('boxen');
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString().split(/ /gim).map(
      (str) => str.split(":").map((str2) => isNaN(Number(str2)) ? str2 : sharpyy2(str2, "txCyan")).join(":")
    ).join(" ");
    return console.info(boxen(message, { padding: 1, margin: 1, borderStyle: "round", borderColor: color, title: `${time} - ${sharpyy2("XERNERX", "txRainbow", "bold")} - ${title || ""}` }));
  }
}();

// src/util/prompts.ts
var init = false;
async function start(client) {
  if (init) return;
  if (client.settings.debug) XernerxLog_default.info("Debug mode enabled, preventing console clear and logging all handlings...");
  else console.clear();
  const { default: ora, spinners } = await import('ora');
  const { default: boxen } = await import('boxen');
  console.info(
    boxen(sharpyy2("XERNERX", "txRainbow", "bold", "underlines"), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      height: 3,
      align: "center",
      borderColor: "magenta",
      fullscreen: /* @__PURE__ */ __name((width, height) => [width - 5, height], "fullscreen")
    })
  );
  if (!client.options.intents.has("Guilds"))
    XernerxLog_default.warn("Your bot is signed in without the Guilds intent, this may cause issues with the bot.", new URL("https://discord.com/developers/docs/topics/gateway#gateway-intents"));
  const spinner = ora();
  spinner.spinner = spinners.dots12;
  spinner.start();
  let index = 0;
  setInterval(async () => {
    calculateStats(client);
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString().split(/ /gim).map(
      (str) => str.split(":").map((str2) => isNaN(Number(str2)) ? str2 : sharpyy2(str2, "txCyan")).join(":")
    ).join(" "), ram = `${sharpyy2(String(Math.round(process.memoryUsage().rss / 1e4) / 100), "txCyan")}mb`;
    const colors = ["red", "green", "yellow", "blue", "magenta", "cyan"];
    const baseText = `${sharpyy2("XERNERX", "txRainbow", "bold")} | ${time} | ${ram} | `;
    if (client.user) {
      spinner.color = colors[index];
      const counts = {
        local: client.commands.stats.slash.local + client.commands.stats.message.local + client.commands.stats.context.local,
        global: client.commands.stats.slash.global + client.commands.stats.message.global + client.commands.stats.context.global
      };
      spinner.text = boxen(
        Object.entries({
          "Name": sharpyy2(client.user.tag, "txBlue"),
          "Status": `${sharpyy2("Online", "txGreen")} | ${client.settings.global ? sharpyy2("Global", "txGreen") : sharpyy2("Local", "txRed")}`,
          "Uptime": client.util.uptime(client.uptime).split("").map((c) => isNaN(Number(c)) ? c : sharpyy2(c, "txCyan")).join(""),
          "Commands": client.settings.global ? `${counts.local ? `local: ${counts.local}` : ""}|${counts.global ? `global: ${counts.global}` : ""}` : counts.local + counts.global,
          "RAM Usage": ram,
          "Guilds": (await Promise.all(client.settings.guilds.map(async (id) => sharpyy2((await client.guilds.fetch(id))?.name || id, "txBlue")))).join(", "),
          "Owners": (await Promise.all(client.settings.owners.map(async (id) => sharpyy2((await client.users.fetch(id))?.username || id, "txBlue")))).join(", "),
          "GuildCount": sharpyy2(String(client.stats.guilds), "txCyan"),
          "UserCount": sharpyy2(String(client.stats.users), "txCyan"),
          "ShardCount": sharpyy2(String(client.stats.shardCount), "txCyan")
        }).map(([key, value]) => `${key}: ${value}`).join("\n"),
        {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "magenta",
          title: time + " - " + sharpyy2("XERNERX", "txRainbow", "bold") + "\x1B[35m",
          height: 15,
          fullscreen: /* @__PURE__ */ __name((width, height) => [width - 5, height], "fullscreen")
        }
      );
    } else {
      spinner.color = "green";
      spinner.text = baseText + `Connecting to Discord${index == 0 ? "." : index == 1 ? ".." : index == 2 ? "..." : ""}`;
    }
    index++;
    if (index == colors.length - 1) index = 0;
  }, 250);
  init = true;
}
__name(start, "start");
function calculateStats(client) {
  client.stats.guilds = client.guilds.cache.size;
  client.stats.users = client.users.cache.size;
  client.stats.shardCount = client.options.shardCount || null;
}
__name(calculateStats, "calculateStats");
var Handler = class {
  static {
    __name(this, "Handler");
  }
  constructor(client) {
    this.client = client;
  }
  async readdir(directory) {
    const dirpath = path.resolve(directory);
    if (this.client.settings.debug) XernerxLog_default.debug(`Attempting to read directory ${link(directory, new URL(dirpath))}`);
    try {
      const files = fs.readdirSync(dirpath);
      return files.filter((file) => file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs"));
    } catch (error) {
      XernerxLog_default.error(`Error reading directory ${link(directory, new URL(dirpath))}:`, error);
      return [];
    }
  }
  async load(filepath) {
    if (this.client.settings.debug) XernerxLog_default.debug(`Attempting to load ${link(filepath, new URL(filepath))}`);
    try {
      const file = (await import(`file://${filepath}`))?.default || await import(`file://${filepath}`);
      const openFile = new file();
      const [collection, group] = openFile.collection.split(".");
      group ? this.client[group][collection].set(openFile._id, openFile) : this.client[collection].set(openFile._id, openFile);
      if (this.client.settings.debug) XernerxLog_default.debug(`Loaded ${link(openFile._id, new URL(filepath))}`);
      return openFile;
    } catch (error) {
      XernerxLog_default.error(`Error loading ${link(filepath, new URL(filepath))}:`, error);
      return null;
    }
  }
};
var CommandHandler = class extends Handler {
  static {
    __name(this, "CommandHandler");
  }
  constructor(client) {
    super(client);
  }
  async loadSlashCommands(options) {
    if (!this.client.modules.options.slash) this.client.modules.options.slash = {};
    this.client.modules.options.slash.global = options.global ?? this.client.settings.global;
    for (const file of await this.readdir(options.directory)) {
      const command = await this.load(path__default.resolve(`${options.directory}/${file}`));
      if (!command) continue;
      if (command.filetype == "XernerxMessageCommand" || command.filetype == "XernerxSlashCommand" || command.filetype == "XernerxContextCommand") {
        if (!this.client.modules.options.slash.global) this.client.commands.stats.slash.local++;
        else if (!command.global) this.client.commands.stats.slash.local++;
        else this.client.commands.stats.slash.global++;
      }
    }
  }
  async loadMessageCommands(options) {
  }
  async loadContextCommands(options) {
  }
};

// src/util/Util.ts
var Util = class {
  static {
    __name(this, "Util");
  }
  constructor(client) {
    this.client = client;
  }
};

// src/util/ClientUtil.ts
var ClientUtil = class extends Util {
  static {
    __name(this, "ClientUtil");
  }
  constructor(client) {
    super(client);
  }
  uptime(timestamp) {
    if (!timestamp) timestamp = this.client.uptime || 0;
    let totalSeconds = timestamp / 1e3;
    let years = Math.floor(totalSeconds / 31536e3);
    totalSeconds %= 31536e3;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    if (years >= 1) return `${years}y ${days}d ${hours}h ${minutes}m`;
    else if (days >= 1) return `${days}d ${hours}h ${minutes}m`;
    else if (hours >= 1) return `${hours}h ${minutes}m`;
    else if (minutes >= 1) return `${minutes}m ${seconds}s`;
    else return `${seconds}s`;
  }
};

// src/client/XernerxClient.ts
var XernerxClient = class extends Discord.Client {
  static {
    __name(this, "XernerxClient");
  }
  constructor(DiscordOptions, XernerxOptions, config) {
    super(DiscordOptions);
    this.settings = z.object({
      // required settings
      token: z.string(),
      // optional settings
      global: z.boolean().default(false),
      owners: z.array(z.string()).default([]),
      guilds: z.array(z.string()).default([]),
      // dev settings
      debug: z.boolean().default(false)
    }).parse({ ...XernerxOptions, ...config });
    this.stats = {
      guilds: null,
      users: null,
      shardId: null,
      shardCount: null,
      shards: null,
      voteCount: null,
      votes: null
    };
    this.util = new ClientUtil(this);
    start(this);
    this.modules = {
      commandHandler: new CommandHandler(this),
      options: {}
    };
    this.commands = {
      message: new Discord.Collection(),
      slash: new Discord.Collection(),
      context: new Discord.Collection(),
      stats: {
        slash: {
          local: 0,
          global: 0
        },
        message: {
          local: 0,
          global: 0
        },
        context: {
          local: 0,
          global: 0
        }
      }
    };
    this.events = new Discord.Collection();
    this.inhibitors = new Discord.Collection();
    this.connect();
  }
  async connect() {
    this.deploy();
    this.login(this.settings.token);
  }
  async deploy() {
    this.once("ready", async (client) => {
      const commands = { local: [], global: [] };
      if (this.settings.global) {
        if (!this.modules.options.slash?.global) commands.global.push(...this.commands.slash);
        else {
          commands.global.push(...this.commands.slash.filter((c) => c.global));
          commands.local.push(...this.commands.slash.filter((c) => !c.global));
        }
        if (!this.modules.options.context?.global) commands.global.push(...this.commands.context);
        else {
          commands.global.push(...this.commands.context.filter((c) => c.global));
          commands.local.push(...this.commands.context.filter((c) => !c.global));
        }
      } else commands.local.push(...this.commands.context, ...this.commands.slash);
      for (const id of this.settings.guilds) {
        const guild = await this.guilds.fetch(id);
        if (!commands.local.length) break;
        if (this.settings.debug) XernerxLog_default.debug(`Attempting to deploy commands to guild: ${sharpyy2(guild.name, "txBlue")}`);
        this.rest.put(Discord.Routes.applicationGuildCommands(client.user.id, id), { body: commands.local.map(([id2, command]) => command.toJSON()) });
        await XernerxLog_default.box(
          commands.local.map(([id2]) => sharpyy2(id2, "txYellow")).join(", "),
          "red",
          `Deployed ${sharpyy2("local", "txRed", "bold")} commands in ${sharpyy2(guild.name, "txBlue")}`
        );
      }
      if (this.settings.global) {
        if (this.settings.debug) XernerxLog_default.debug(`Attempting to deploy commands globally`);
        this.rest.put(Discord.Routes.applicationCommands(client.user.id), { body: [] });
        await XernerxLog_default.box(commands.global.map(([id]) => sharpyy2(id, "txYellow")).join(", "), "green", `Deployed ${sharpyy2("global", "txGreen", "bold")} commands`);
      }
    });
  }
};
var XernerxSlashCommand = class extends Discord.SlashCommandBuilder {
  static {
    __name(this, "XernerxSlashCommand");
  }
  constructor(options) {
    super();
    this._id = options.id;
    this.setName(options.name);
    this.setDescription(options.description);
    this.global = options.global ?? true;
    this.filetype = "XernerxSlashCommand";
    this.collection = "slash.commands";
  }
};

export { XernerxClient, XernerxSlashCommand };
//# sourceMappingURL=main.js.map
//# sourceMappingURL=main.js.map