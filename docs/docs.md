![Xernerx](./styles/banner.png)

# A lightweight class based Discord.js framework.

> - [Client](#Client)
> - [Handlers](#Handlers)
>   > - [Commands](#Commands)
>   > - [Events](#Events)
> - [Arguments](#Arguments)
>   > - [Types](#Argument#Types)

## Client

> An extended discord.js client.
>
> ```js
> const { Client } require('xernerx');
>
> const client = new Client({intents:[0]});
> ```
>
> | parameter       | type     | default | required | description                                                     |
> | --------------- | -------- | ------- | -------- | --------------------------------------------------------------- |
> | intents         | Number[] | none    | true     | Discord#Intents                                                 |
> | partials        | []       | none    | false    | Discord#Partials                                                |
> | prefix          | String[] | none    | false    | Prefix for message commands                                     |
> | ownerId         | String[] | none    | false    | Id(s) of the bot developer(s)                                   |
> | guildId         | String   | none    | true     | local guild Id                                                  |
> | global          | Boolean  | false   | true     | Whether the interaction commands are local or global            |
> | ignoreOwner     | Boolean  | false   | false    | Whether the bot should ignore execute validation or not         |
> | defaultCooldown | Number   | 0       | false    | The cooldown a user gets before executing another command       |
> | color           | Object   | FLAGS   | false    | This appends colors to the bot                                  |
> | config          | Object   | {}      | false    | Here you can save any info to the bot                           |
> | logging         | Boolean  | false   | false    | Whether the bot should log any events on ready                  |
> | cacheTime       | Number   | 300000  | false    | The amount of time before a message gets deleted from the cache |
> | messages        | Object   | {}      | false    | The location where commands get linked with their executions    |

## Handlers

> Below you can see all the different types of handlers. Each command handler needs it's own folder.
>
> ### Commands
>
> ```js
> const { Client, CommandHandler } = require("xernerx");
>
> const client = new Client({ intents: [0] });
>
> const commandHandler = new CommandHandler({ client: client });
> ```
>
> > methods
> >
> > - [.loadMessageCommands()](<#.loadMessageCommands()>)
> > - [.loadInteractionCommands()](<#.loadInteractionCommands()>)
> > - [.loadContextMenuCommands()](<#.loadContextMenuCommands()>)
> >
> > #### .loadMessageCommands()
> >
> > The message command handler.
> >
> > | parameter | type    | default | required | description                              |
> > | --------- | ------- | ------- | -------- | ---------------------------------------- |
> > | path      | String  | none    | true     | The path of your message command folder. |
> > | logging   | Boolean | false   | false    | Whether the bot logs commands on start.  |
> >
> > #### .loadInteractionCommands()
> >
> > The interaction command handler.
> >
> > | parameter | type    | default | required | description                              |
> > | --------- | ------- | ------- | -------- | ---------------------------------------- |
> > | path      | String  | none    | true     | The path of your message command folder. |
> > | logging   | Boolean | false   | false    | Whether the bot logs commands on start.  |
> >
> > #### .loadContextMenuCommands()
> >
> > The context menu command handler.
> >
> > | parameter | type    | default | required | description                              |
> > | --------- | ------- | ------- | -------- | ---------------------------------------- |
> > | path      | String  | none    | true     | The path of your message command folder. |
> > | logging   | Boolean | false   | false    | Whether the bot logs commands on start.  |
