/** @format */

import { XernerxSlashCommand } from "../../../dist/main.js";

export default class PingCommand extends XernerxSlashCommand {
  constructor() {
    super({
      id: "ping",
      name: "ping",
      description: "Ping the bot.",
      global: true,
    });
  }
}
