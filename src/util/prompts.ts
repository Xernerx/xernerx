/** @format */

import sharpyy from "sharpyy";
// import { Color } from 'ora';

import { XernerxClient } from "../client/XernerxClient.js";
import XernerxLog from "../tools/XernerxLog.js";

let init = false;

export async function start(client: XernerxClient) {
  if (init) return;

  if (client.settings.debug)
    XernerxLog.info(
      "Debug mode enabled, preventing console clear and logging all handlings...",
    );
  else console.clear();

  const { default: ora, spinners } = await import("ora");
  const { default: boxen } = await import("boxen");

  console.info(
    boxen(sharpyy("XERNERX", "txRainbow", "bold", "underlines"), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      height: 3,
      align: "center",
      borderColor: "magenta",
      fullscreen: (width, height) => [width - 5, height],
    }),
  );

  if (!client.options.intents.has("Guilds"))
    XernerxLog.warn(
      "Your bot is signed in without the Guilds intent, this may cause issues with the bot.",
      new URL(
        "https://discord.com/developers/docs/topics/gateway#gateway-intents",
      ),
    );

  const spinner = ora();

  spinner.spinner = spinners.dots12;

  if (process.xernerx.log?.type == "dynamic") spinner.start();

  setInterval(async () => {
    // Update Discord stats
    calculateStats(client);

    // Update commandline

    if (process.xernerx.log?.type == "static" && !client.user) {
      XernerxLog.info(await embed(client));
    } else if (process.xernerx.log?.type == "static" && client.user && !init) {
      XernerxLog.info(await embed(client));

      init = true;
    } else {
      spinner.text = await embed(client);
    }
  }, 250);
}

function calculateStats(client: XernerxClient) {
  client.stats.guilds = client.guilds.cache.size;
  client.stats.users = client.users.cache.size;
  client.stats.shardCount = client.options.shardCount || null;
}

async function embed(client: XernerxClient) {
  const { default: boxen } = await import("boxen");

  const time = new Date()
      .toLocaleTimeString()
      .split(/ /gim)
      .map((str) =>
        str
          .split(":")
          .map((str) => (isNaN(Number(str)) ? str : sharpyy(str, "txCyan")))
          .join(":"),
      )
      .join(" "),
    ram = `${sharpyy(String(Math.round(process.memoryUsage().rss / 10000) / 100), "txCyan")}mb`;

  if (client.user) {
    const counts = {
      local:
        client.stats.commands.slash.local +
        client.stats.commands.message.local +
        client.stats.commands.context.local,
      global:
        client.stats.commands.slash.global +
        client.stats.commands.message.global +
        client.stats.commands.context.global,
    };

    return boxen(
      Object.entries({
        Name: sharpyy(client.user.tag, "txBlue"),
        Status: `${sharpyy("Online", "txGreen")} | ${client.settings.global ? sharpyy("Global", "txGreen") : sharpyy("Local", "txRed")}`,
        Uptime: client.util
          .uptime(client.uptime)
          .split("")
          .map((c) => (isNaN(Number(c)) ? c : sharpyy(c, "txCyan")))
          .join(""),
        Commands: client.settings.global
          ? `${counts.local ? `local: ${counts.local}` : ""}|${counts.global ? `global: ${counts.global}` : ""}`
          : counts.local + counts.global,
        "RAM Usage": ram,
        Guilds: (
          await Promise.all(
            client.settings.guilds.map(async (id) =>
              sharpyy((await client.guilds.fetch(id))?.name || id, "txBlue"),
            ),
          )
        ).join(", "),
        Owners: (
          await Promise.all(
            client.settings.owners.map(async (id) =>
              sharpyy((await client.users.fetch(id))?.username || id, "txBlue"),
            ),
          )
        ).join(", "),
        GuildCount: sharpyy(String(client.stats.guilds), "txCyan"),
        UserCount: sharpyy(String(client.stats.users), "txCyan"),
        ShardCount: sharpyy(String(client.stats.shardCount), "txCyan"),
      })
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "magenta",
        title:
          time + " - " + sharpyy("XERNERX", "txRainbow", "bold") + "\x1B[35m",
        height: 15,
        fullscreen: (width, height) => [width - 5, height],
      },
    );
  } else return `Connecting to Discord`;
}
