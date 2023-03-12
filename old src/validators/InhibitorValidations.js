import { InhibitorType } from '../types/enums.js';
export class InhibitorValidation {
    client;
    action;
    command;
    inhibited;
    constructor(client, action, command) {
        this.client = client;
        this.action = action;
        this.command = command;
        this.inhibited = {};
    }
    async inhibit() {
        for (const inhibitor of this.client.inhibitors) {
            const inhibit = inhibitor[1];
            if (inhibit)
                this.inhibited[inhibit.name] = await inhibit.check(this.action, this.args(this.action, inhibit.type));
        }
        for (const inhibit of Object.values(this.inhibited)) {
            if (inhibit)
                return this.inhibited;
        }
    }
    args(action, type) {
        if (type === InhibitorType.Channel)
            return action.channel;
        if (type === InhibitorType.User)
            return action.author || action.user;
        if (type === InhibitorType.Guild)
            return action.guild;
        if (type === InhibitorType.Member)
            return action.member;
        // if (type === InhibitorType.Command)
        // 	return this.client.util.getAllCommands().filter(this.command.name);
        // if (type === InhibitorType.MessageCommand)
        // 	return this.client.util.getAllMessageCommands().find(this.command.name);
        // if (type === InhibitorType.SlashCommand)
        // 	return this.client.util.getAllSlashCommands().find(this.command.name);
        // if (type === InhibitorType.ContextCommand)
        // 	return this.client.util.getAllContextCommands().find(this.command.name);
    }
}
