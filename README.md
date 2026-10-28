<!-- @format -->

![Xernerx Banner](https://xernerx.com/banner.png)

# xernerx

The official all-in-one **Xernerx Suite SDK & Discord Bot Framework** meta-package, re-exporting the entire `@xernerx/*` ecosystem from a single entry point.

---

## Features

- **Unified Single-Package Entry Point**: Re-exports `@xernerx/framework`, `@xernerx/commands`, `@xernerx/stats`, `@xernerx/terminal`, and `@xernerx/websocket` (plus seamless integration with `@xernerx/hooks`).
- **Built-in CLI (`create-xernerx-app` & `xernerx`)**: Interactive project scaffolding (`npx create-xernerx-app` / `npx xernerx create`) with TypeScript/JavaScript templates, selectable `@xernerx/*` integrations, `.env` setup, and bot lifecycle commands (`xernerx dev`, `xernerx build`, `xernerx start`).
- **Slash, Message & Context Menu Command Handlers**: Automatic command discovery, deployment, subcommands, autocomplete, cooldowns, permissions, Discord SKU monetization (`premium`), and Xernerx user engagement gating (`voted`, `reviewed`, `tipped`).
- **Built-in Jishaku-Inspired Developer Suite (`xc!`)**: 12 owner-only runtime diagnostic and evaluation commands (`xc!`, `evaluate`, `shell`, `git`, `source`, `haste`, `ping`, `debug`, `repeat`, `su`, `transpile`, `documentation`) with automatic command body syncing to `https://api.xernerx.com`.
- **Automated Bot Telemetry (`XernerxStats` & `StatsClient`)**: Automatic shard-aware reporting and full CRUD management for guild, user, and shard telemetry on the Xernerx Suite API.
- **Real-Time WebSocket Gateway (`XernerxWebsocket`)**: Promise-based RPC client (`get`, `create`, `update`, `delete`) for `wss://ws.xernerx.com`.
- **Formatted CLI Logger & TTY Spinner (`Terminal` & `Spinner`)**: Scoped logs, boxed banners, execution timers, and interactive spinners.
- **Smart `post()` Dispatcher**: Unified helper that automatically routes `StatsPayload` and `CommandsPayload` requests to the appropriate Xernerx Suite v1 endpoint.

---

## Install

### Quickstart (CLI Scaffolding)

Scaffold a new Xernerx Discord bot with interactive prompts for TypeScript/JavaScript, `@xernerx/*` integrations, and `.env` configuration:

```bash
npx xernerx create my-bot
# or when create-xernerx-app is installed / published:
npx create-xernerx-app my-bot
```

Inside your project, use the `xernerx` CLI to develop, build, and run your bot:

```bash
xernerx dev     # Watch TypeScript/JavaScript changes & auto-restart bot
xernerx build   # Compile TypeScript to dist/
xernerx start   # Start production bot
```

### Manual Installation

```bash
pnpm add xernerx discord.js @discordjs/core
```

```bash
npm install xernerx discord.js @discordjs/core
```

---

## Setup

Create your bot client by extending `XernerxClient` and configuring your handlers, extensions, and telemetry:

```ts
import path from 'node:path';
import { GatewayIntentBits } from 'discord.js';
import { XernerxClient, XernerxCommands, XernerxStats, XernerxWebsocket, Terminal } from 'xernerx';

export class WebSocket extends XernerxWebsocket {
	constructor() {
		super({
			token: process.env.XERNERX_WS_TOKEN!,
			dev: process.env.NODE_ENV === 'DEVELOPMENT',
		});

		this.connect();
	}
}

export class Client extends XernerxClient {
	private readonly logger = new Terminal({ scope: 'BOT', tag: 'Main' });
	public readonly websocket = new WebSocket();

	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
			token: process.env.DISCORD_BOT_TOKEN!,
			guildId: ['784094726432489522'],
			owners: ['482513687417061376'],
			global: process.env.NODE_ENV !== 'DEVELOPMENT',
		});

		this.modules.eventHandler.loadEvents({
			directory: path.resolve('./dist/events'),
		});

		this.modules.commandHandler.loadSlashCommands({
			directory: path.resolve('./dist/commands/slash'),
		});

		this.modules.commandHandler.loadMessageCommands({
			directory: path.resolve('./dist/commands/message'),
			prefix: ['!'],
			mention: true,
		});

		this.modules.commandHandler.loadContextCommands({
			directory: path.resolve('./dist/commands/context'),
		});

		this.modules.extensionHandler.loadExtensions(
			new XernerxCommands(this, {
				token: process.env.XERNERX_TOKEN!,
				prefix: 'xc!',
			}),
			new XernerxStats(this, {
				token: process.env.XERNERX_TOKEN!,
				interval: 30 * 60_000,
			})
		);

		this.connect();
		this.logger.info('Initialized Xernerx bot client.');
	}
}

new Client();
```

---

## Ecosystem Packages Included

| Package                                                                  | Scope | Documentation                                                | Description                                                                                                                  |
| ------------------------------------------------------------------------ | ----- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [`@xernerx/framework`](https://www.npmjs.com/package/@xernerx/framework) | `XF`  | [Docs](https://docs.xernerx.com/packages/@xernerx/framework) | Class-based Discord.js framework (`XernerxClient`, `XernerxShardClient`, builders, handlers, validators, `XernerxUser`).     |
| [`@xernerx/commands`](https://www.npmjs.com/package/@xernerx/commands)   | `XC`  | [Docs](https://docs.xernerx.com/packages/@xernerx/commands)  | Jishaku-inspired developer commands (`xc!`) & Commands REST API SDK (`XernerxCommands`, `CommandsClient`, `postCommands`).   |
| [`@xernerx/stats`](https://www.npmjs.com/package/@xernerx/stats)         | `XS`  | [Docs](https://docs.xernerx.com/packages/@xernerx/stats)     | Automated bot telemetry extension & Stats REST API SDK (`XernerxStats`, `StatsClient`, `postStats`).                         |
| [`@xernerx/hooks`](https://www.npmjs.com/package/@xernerx/hooks)         | `XH`  | [Docs](https://docs.xernerx.com/packages/@xernerx/hooks)     | Signed webhook receiver (`X-Xernerx-Signature`, `X-Xernerx-Secret`) & user engagement cache (`voted`, `reviewed`, `tipped`). |
| [`@xernerx/terminal`](https://www.npmjs.com/package/@xernerx/terminal)   | `XT`  | [Docs](https://docs.xernerx.com/packages/@xernerx/terminal)  | Formatted CLI logger and interactive TTY spinner (`Terminal`, `terminal`, `Spinner`).                                        |
| [`@xernerx/websocket`](https://www.npmjs.com/package/@xernerx/websocket) | `XW`  | [Docs](https://docs.xernerx.com/packages/@xernerx/websocket) | Promise-based RPC client for the Xernerx WebSocket Gateway (`XernerxWebsocket`).                                             |

---

## Usage Examples

### Slash Command (`SlashCommandBuilder`)

```ts
import { SlashCommandBuilder, type SlashCommandOptions } from 'xernerx';

export default class PingCommand extends SlashCommandBuilder {
	constructor() {
		super('ping', {
			name: 'ping',
			description: 'Check bot latency and your Xernerx supporter status.',
			voted: true,
			tipped: false,
		});
	}

	override async exec({ interaction }: SlashCommandOptions) {
		await interaction.util.reply({
			content: `🏓 Pong! (\`${this.client.ws.ping}ms\`) | Voted: **${interaction.user.voted}** | Tipped: **${interaction.user.tipped}** credits`,
			ephemeral: true,
		});
	}
}
```

### Event Listener (`EventBuilder`)

```ts
import { EventBuilder, Terminal } from 'xernerx';

export default class ReadyEvent extends EventBuilder {
	private readonly console = new Terminal({ scope: 'EV', tag: 'Ready' });

	constructor() {
		super('clientReady', {
			name: 'clientReady',
			emitter: 'client',
			once: true,
		});
	}

	override async run() {
		this.console.box(`ONLINE AS ${this.client.user?.tag}`);
		this.console.info(`Serving ${this.client.guilds.cache.size} guilds.`);
	}
}
```

### Standalone Stats & Commands API Clients (`StatsClient` & `CommandsClient`)

```ts
import { StatsClient, CommandsClient, Terminal } from 'xernerx';

export class BotStats extends StatsClient {
	private readonly console = new Terminal({ scope: 'XS' });

	constructor() {
		super({
			botId: 'YOUR_BOT_ID',
			token: process.env.XERNERX_TOKEN!,
		});
	}

	async sync() {
		await this.post({
			guildCount: 1500,
			shardCount: 2,
			userCount: 450000,
		});
		const history = await this.get();
		this.console.info(`Recorded ${history.length} telemetry snapshots.`);
	}
}

export class BotCommands extends CommandsClient {
	private readonly console = new Terminal({ scope: 'XC' });

	constructor() {
		super({
			botId: 'YOUR_BOT_ID',
			token: process.env.XERNERX_TOKEN!,
		});
	}

	async sync() {
		await this.sync([
			{
				name: 'ping',
				description: 'Replies with Pong!',
				type: 1,
			},
		]);
		const commands = await this.get();
		this.console.info(`Synced ${commands.length} commands to Xernerx.`);
	}
}
```

### Unified `post()`, `postStats()`, and `postCommands()` Helpers

`xernerx` exports `postStats`, `postCommands`, and a smart `post(data, token, baseUrl?)` function that dispatches based on the payload shape:

```ts
import { post, postStats, postCommands, Terminal } from 'xernerx';

export class ApiSync extends Terminal {
	constructor() {
		super({ scope: 'API' });
	}

	async run() {
		// Automatically dispatches to postStats (/v1/bots/:id/stats)
		await post({ id: 'YOUR_BOT_ID', guildCount: 120, userCount: 15000, shardCount: 1 }, process.env.XERNERX_TOKEN!);

		// Automatically dispatches to postCommands (/v1/bots/:id/commands)
		await post(
			{
				id: 'YOUR_BOT_ID',
				commands: [{ name: 'ping', description: 'Replies with Pong!', type: 1 }],
			},
			process.env.XERNERX_TOKEN!
		);

		// Or call postStats / postCommands explicitly
		await postStats({ id: 'YOUR_BOT_ID', guildCount: 125 }, process.env.XERNERX_TOKEN!);
		await postCommands({ id: 'YOUR_BOT_ID', commands: [{ name: 'help', description: 'Help menu', type: 1 }] }, process.env.XERNERX_TOKEN!);

		this.info('Successfully posted stats and commands to Xernerx Suite API.');
	}
}

new ApiSync().run();
```

---

## Documentation & API Reference

Full documentation, interactive API playgrounds, and symbol references are hosted on the **[Xernerx Documentation](https://docs.xernerx.com)** and the **[`xernerx` Package Reference](https://docs.xernerx.com/packages/xernerx)**.

### Package Documentation Paths

- **[`xernerx` (Collection Reference)](https://docs.xernerx.com/packages/xernerx)**
  - [`XernerxCLI`](https://docs.xernerx.com/packages/xernerx#class-XernerxCLI) | [`post()`](https://docs.xernerx.com/packages/xernerx#function-post) | [`postStats()`](https://docs.xernerx.com/packages/xernerx#function-postStats) | [`postCommands()`](https://docs.xernerx.com/packages/xernerx#function-postCommands) | [`BaseClient`](https://docs.xernerx.com/packages/xernerx#class-BaseClient)
- **[`@xernerx/framework`](https://docs.xernerx.com/packages/@xernerx/framework)**
  - **Clients**: [`XernerxClient`](https://docs.xernerx.com/packages/@xernerx/framework#class-XernerxClient) | [`XernerxShardClient`](https://docs.xernerx.com/packages/@xernerx/framework#class-XernerxShardClient)
  - **Builders**: [`SlashCommandBuilder`](https://docs.xernerx.com/packages/@xernerx/framework#class-SlashCommandBuilder) | [`MessageCommandBuilder`](https://docs.xernerx.com/packages/@xernerx/framework#class-MessageCommandBuilder) | [`ContextCommandBuilder`](https://docs.xernerx.com/packages/@xernerx/framework#class-ContextCommandBuilder) | [`EventBuilder`](https://docs.xernerx.com/packages/@xernerx/framework#class-EventBuilder) | [`InhibitorBuilder`](https://docs.xernerx.com/packages/@xernerx/framework#class-InhibitorBuilder) | [`BaseBuilder`](https://docs.xernerx.com/packages/@xernerx/framework#class-BaseBuilder)
  - **Handlers**: [`CommandHandler`](https://docs.xernerx.com/packages/@xernerx/framework#class-CommandHandler) | [`EventHandler`](https://docs.xernerx.com/packages/@xernerx/framework#class-EventHandler) | [`ExtensionHandler`](https://docs.xernerx.com/packages/@xernerx/framework#class-ExtensionHandler) | [`InhibitorHandler`](https://docs.xernerx.com/packages/@xernerx/framework#class-InhibitorHandler) | [`BaseHandler`](https://docs.xernerx.com/packages/@xernerx/framework#class-BaseHandler)
  - **Models & Utils**: [`XernerxUser`](https://docs.xernerx.com/packages/@xernerx/framework#class-XernerxUser) | [`XernerxGuild`](https://docs.xernerx.com/packages/@xernerx/framework#class-XernerxGuild) | [`XernerxMonitisation`](https://docs.xernerx.com/packages/@xernerx/framework#class-XernerxMonitisation) | [`InteractionArguments`](https://docs.xernerx.com/packages/@xernerx/framework#class-InteractionArguments) | [`InteractionUtil`](https://docs.xernerx.com/packages/@xernerx/framework#class-InteractionUtil) | [`MessageUtil`](https://docs.xernerx.com/packages/@xernerx/framework#class-MessageUtil)
  - **Validators**: [`BaseValidator`](https://docs.xernerx.com/packages/@xernerx/framework#class-BaseValidator) | [`SlashCommandValidator`](https://docs.xernerx.com/packages/@xernerx/framework#class-SlashCommandValidator) | [`ContextCommandValidator`](https://docs.xernerx.com/packages/@xernerx/framework#class-ContextCommandValidator) | [`InhibitorValidator`](https://docs.xernerx.com/packages/@xernerx/framework#class-InhibitorValidator)
- **[`@xernerx/commands`](https://docs.xernerx.com/packages/@xernerx/commands)**
  - **Classes**: [`XernerxCommands`](https://docs.xernerx.com/packages/@xernerx/commands#class-XernerxCommands) | [`CommandsClient`](https://docs.xernerx.com/packages/@xernerx/commands#class-CommandsClient) | [`BaseClient`](https://docs.xernerx.com/packages/@xernerx/commands#class-BaseClient)
  - **Functions**: [`post()`](https://docs.xernerx.com/packages/@xernerx/commands#function-post) | [`serializeCommand()`](https://docs.xernerx.com/packages/@xernerx/commands#function-serializeCommand) | [`extractClientCommands()`](https://docs.xernerx.com/packages/@xernerx/commands#function-extractClientCommands) | [`embedify()`](https://docs.xernerx.com/packages/@xernerx/commands#function-embedify) | [`reply()`](https://docs.xernerx.com/packages/@xernerx/commands#function-reply) | [`haste()`](https://docs.xernerx.com/packages/@xernerx/commands#function-haste) | [`shell()`](https://docs.xernerx.com/packages/@xernerx/commands#function-shell) | [`source()`](https://docs.xernerx.com/packages/@xernerx/commands#function-source) | [`resolveCommandSource()`](https://docs.xernerx.com/packages/@xernerx/commands#function-resolveCommandSource)
- **[`@xernerx/stats`](https://docs.xernerx.com/packages/@xernerx/stats)**
  - **Classes & Functions**: [`XernerxStats`](https://docs.xernerx.com/packages/@xernerx/stats#class-XernerxStats) | [`StatsClient`](https://docs.xernerx.com/packages/@xernerx/stats#class-StatsClient) | [`BaseClient`](https://docs.xernerx.com/packages/@xernerx/stats#class-BaseClient) | [`post()`](https://docs.xernerx.com/packages/@xernerx/stats#function-post)
  - **Interfaces**: [`XernerxStatsSettings`](https://docs.xernerx.com/packages/@xernerx/stats#interface-XernerxStatsSettings) | [`StatsClientOptions`](https://docs.xernerx.com/packages/@xernerx/stats#interface-StatsClientOptions) | [`StatsPayload`](https://docs.xernerx.com/packages/@xernerx/stats#interface-StatsPayload) | [`ShardStats`](https://docs.xernerx.com/packages/@xernerx/stats#interface-ShardStats)
- **[`@xernerx/hooks`](https://docs.xernerx.com/packages/@xernerx/hooks)**
  - **Classes & Interfaces**: [`XernerxHooks`](https://docs.xernerx.com/packages/@xernerx/hooks#class-XernerxHooks) | [`HooksClient`](https://docs.xernerx.com/packages/@xernerx/hooks#class-HooksClient) | [`XernerxHooksOptions`](https://docs.xernerx.com/packages/@xernerx/hooks#interface-XernerxHooksOptions) | [`HooksClientOptions`](https://docs.xernerx.com/packages/@xernerx/hooks#interface-HooksClientOptions) | [`UserEngagementState`](https://docs.xernerx.com/packages/@xernerx/hooks#interface-UserEngagementState)
- **[`@xernerx/terminal`](https://docs.xernerx.com/packages/@xernerx/terminal)**
  - **Classes & Interfaces**: [`Terminal`](https://docs.xernerx.com/packages/@xernerx/terminal#class-Terminal) | [`Spinner`](https://docs.xernerx.com/packages/@xernerx/terminal#class-Spinner) | [`TerminalOptions`](https://docs.xernerx.com/packages/@xernerx/terminal#interface-TerminalOptions) | [`SpinnerOptions`](https://docs.xernerx.com/packages/@xernerx/terminal#interface-SpinnerOptions)
- **[`@xernerx/websocket`](https://docs.xernerx.com/packages/@xernerx/websocket)**
  - **Classes & Interfaces**: [`XernerxWebsocket`](https://docs.xernerx.com/packages/@xernerx/websocket#class-XernerxWebsocket) | [`XernerxWebsocketOptions`](https://docs.xernerx.com/packages/@xernerx/websocket#interface-XernerxWebsocketOptions)

### Platform & Gateway Documentation

- **[Xernerx Documentation Home](https://docs.xernerx.com)**
- **[All NPM Packages Catalog](https://docs.xernerx.com/packages)**
- **[REST API v1 Reference](https://docs.xernerx.com/api/v1)**
  - [API Overview](https://docs.xernerx.com/api/v1#overview) & [Bearer Authentication](https://docs.xernerx.com/api/v1#authentication)
  - [Fetch Bot Profile](https://docs.xernerx.com/api/v1#fetch-bot-profile) | [Update Bot Profile](https://docs.xernerx.com/api/v1#update-bot-profile) | [Bot Badges](https://docs.xernerx.com/api/v1#fetch-bot-badges)
  - [Fetch Bot Stats](https://docs.xernerx.com/api/v1#fetch-bot-stats) | [Post Bot Stats](https://docs.xernerx.com/api/v1#post-bot-stats) | [Update Bot Stats](https://docs.xernerx.com/api/v1#update-bot-stats) | [Delete Bot Stats](https://docs.xernerx.com/api/v1#delete-bot-stats)
  - [Fetch Bot Commands](https://docs.xernerx.com/api/v1#fetch-bot-commands) | [Sync Bot Commands](https://docs.xernerx.com/api/v1#sync-bot-commands) | [Delete Bot Commands](https://docs.xernerx.com/api/v1#delete-bot-commands)
- **[WebSocket Gateway Documentation](https://docs.xernerx.com/websocket)**
  - [Gateway Overview](https://docs.xernerx.com/websocket#overview) | [Connecting](https://docs.xernerx.com/websocket#connecting) | [Authentication](https://docs.xernerx.com/websocket#authentication) | [RPC Protocol](https://docs.xernerx.com/websocket#protocol) | [Services & Actions](https://docs.xernerx.com/websocket#services)
- **[CDN Documentation](https://docs.xernerx.com/cdn)**
- **[Release Changelog](https://info.xernerx.com/changelog#xernerx)**

---

## Support & Links

- [Discord Support Server](https://xernerx.com/discord)
- [`xernerx` Package Documentation](https://docs.xernerx.com/packages/xernerx)
- [Xernerx Developer Portal](https://portal.xernerx.com)
- [Xernerx Website](https://xernerx.com)
