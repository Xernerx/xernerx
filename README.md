<!-- @format -->
<center>

[![](./docs/icons/Xernerx%20-%20Logo%20-%20Purple.png)](https://xernerx.github.io/xernerx)

[![Discord](https://img.shields.io/discord/784094726432489522?logo=discord)](https://discord.gg/teNWyb69dq)
![npm](https://img.shields.io/npm/dw/xernerx)
![npm](https://img.shields.io/npm/dt/xernerx)
![Read the Docs](https://img.shields.io/readthedocs/node)
![npm type definitions](https://img.shields.io/npm/types/xernerx)
![node-current](https://img.shields.io/npm/v/discord.js)
[![wakatime](https://wakatime.com/badge/user/0eeef1b5-98a7-4ec0-ab4c-db00536d5ed1/project/23ab34b7-623b-45e8-b8db-e9f1910589f7.svg)](https://wakatime.com/badge/user/0eeef1b5-98a7-4ec0-ab4c-db00536d5ed1/project/23ab34b7-623b-45e8-b8db-e9f1910589f7)
![node-current](https://img.shields.io/node/v/xernerx)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/xernerx/xernerx)

</center>
# About

Xernerx is a class based discord.js framework. \[BETA\]

It can be customized to be a lightweight handler or a heavy customizable framework that does all the hard work for you

## Features

> - [x] Slash command handler
> - [x] Message command handler
> - [x] Context command handler
> - [x] Event handler (with custom Events)
> - [x] Inhibitor handler
> - [x] Extension handler
> - [x] Client Utilities
> - [x] Message Utilities
> - [x] Interaction Utilities
> - [x] Message command handles
> - [x] Extension support
> - [x] ShardClient

## Links

> - [Documentation](https://xernerx.github.io/xernerx/docs/#v4)
> - [Guide](https://xernerx.github.io/xernerx/guide/#v4)

## Setup

### Settings

```js
import XernerxClient from 'xernerx';

new (class Client extends XernerxClient {
	constructor() {
		super([discordOptions], [xernerxOptions]);

		this.connect('token');
	}
})();
```

### Handlers

There are 5 handlers total

> - Command handler, handles message, slash and context commands
> - Event handler, has all the Discord.js events and more
> - Inhibitor handler, handles conditions before commands are ran globally
> - Extension handler, more info [here](#Extensions)
> - Webhook handler, will allow for top.gg to get your stats (needs a rework)

## Extensions

Xernerx supports the ability to use extensions, features not initially included into your code. You can use any extension based on the [xernerx-extension-builder](https://npmjs.com/xernerx-extension-builder) package, or make your own with it!

## Notes

- Only compatible with ESM
- TypeScript and JavaScript support
