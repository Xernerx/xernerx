<!-- @format -->

# xernerx

The official all-in-one **Xernerx** meta-package, re-exporting all `@xernerx/*` packages from a single entry point:

- [`@xernerx/framework`](https://www.npmjs.com/package/@xernerx/framework) — Discord bot framework (`XernerxClient`, `XernerxShardClient`, command/event/inhibitor builders & handlers)
- [`@xernerx/commands`](https://www.npmjs.com/package/@xernerx/commands) — Developer command extension & Xernerx Suite Commands API SDK (`XernerxCommands`, `CommandsClient`, `postCommands`)
- [`@xernerx/stats`](https://www.npmjs.com/package/@xernerx/stats) — Xernerx Suite Stats API SDK (`XernerxStats`, `StatsClient`, `postStats`)
- [`@xernerx/terminal`](https://www.npmjs.com/package/@xernerx/terminal) — Formatted CLI logger & interactive spinner (`Terminal`, `terminal`, `Spinner`)
- [`@xernerx/websocket`](https://www.npmjs.com/package/@xernerx/websocket) — Xernerx Suite WebSocket client (`XernerxWebsocket`)

## Installation

```bash
pnpm add xernerx discord.js @discordjs/core
```

## Usage

```ts
import { XernerxClient, XernerxCommands, XernerxStats, XernerxWebsocket, terminal } from 'xernerx';
```
