![Xernerx](./styles/banner.png)

# A lightweight class based Discord.js framework.

> - [Client](#Client)
> - [Handlers](#Handlers)
>   - [Commands](#Commands)
>   - [Events](#Events)
> - [Arguments](#Arguments)
>   - [Types](#Argument#Types)

## Client

> <table border="0">
>  <tr>
>     <td>Methods</td>
>     <td>Properties</td>
>  </tr>
>  <tr>
>     <td> - [intents](#Client#Intents)</td>
>     <td></td>
>  </tr>
> </table>
> Methods

## Handlers

> Below you can see all the different types of handlers. Each command handler needs it's own folder.
>
> ### Commands
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
> > | path      | string  | none    | true     | The path of your message command folder. |
> > | logging   | boolean | false   | false    | Whether the bot logs commands on start.  |
> >
> > #### .loadInteractionCommands()
> >
> > The interaction command handler.
> >
> > | parameter | type    | default | required | description                              |
> > | --------- | ------- | ------- | -------- | ---------------------------------------- |
> > | path      | string  | none    | true     | The path of your message command folder. |
> > | logging   | boolean | false   | false    | Whether the bot logs commands on start.  |
> >
> > #### .loadContextMenuCommands()
> >
> > The context menu command handler.
> >
> > | parameter | type    | default | required | description                              |
> > | --------- | ------- | ------- | -------- | ---------------------------------------- |
> > | path      | string  | none    | true     | The path of your message command folder. |
> > | logging   | boolean | false   | false    | Whether the bot logs commands on start.  |
