![Xernerx](./styles/banner.png)

# A lightweight class based Discord.js framework.

> - [Client](#Client)
> - [Handlers](#Handlers)
>   - [Message Commands](#Handlers#Message)
>   - [Interaction Commands](#Handlers#Interaction)
>   - [Context Menu Commands](#Handlers#ContextMenu)
>   - [Events](#Handlers#Events)
> - [Arguments](#Arguments)
>   - [Types](#Argument#Types)

## Client

> - [intents](#Client#Intents)

## Handlers

### Handlers#Message

| parameter | type    | default | required | description                              |
| --------- | ------- | ------- | -------- | ---------------------------------------- |
| path      | string  | none    | true     | The path of your message command folder. |
| logging   | boolean | false   | false    | Whether the bot logs commands on start.  |
