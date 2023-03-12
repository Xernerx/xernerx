import XernerxError from '../tools/XernerxError.js';
export class ClientUtil {
    client;
    constructor(client) {
        this.client = client;
    }
    uptime(timestamp) {
        if (!timestamp)
            timestamp = this.client.uptime || 0;
        let totalSeconds = timestamp / 1000;
        let years = Math.floor(totalSeconds / 31536000);
        totalSeconds %= 31536000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        if (years >= 1)
            return `${years}y ${days}d ${hours}h ${minutes}m`;
        else if (days >= 1)
            return `${days}d ${hours}h ${minutes}m`;
        else if (hours >= 1)
            return `${hours}h ${minutes}m`;
        else if (minutes >= 1)
            return `${minutes}m ${seconds}s`;
        else
            return `${seconds}s`;
    }
    getSubcommands(name) {
        if (!name || typeof name !== 'string')
            throw new XernerxError(`Expected name to be of type string, received ${typeof name} instead!`);
        const commands = [];
        this.getAllCommands()
            .filter((c) => (c.data?.name?.toLowerCase() || c.name?.toLowerCase()) == name?.toLowerCase())
            .map((c) => {
            if (c?.data?.options?.length > 0) {
                c?.data?.options?.map((option) => {
                    if (!option?.type) {
                        if (option?.options?.length > 0) {
                            option?.options?.map((opt) => {
                                if (!opt.type) {
                                    commands.push({
                                        name: c.data.name,
                                        formattedName: `${c.data.name} ${option.name} ${opt.name}`,
                                        description: opt.description,
                                        category: c.category || null,
                                        commandType: c.commandType,
                                    });
                                }
                                else {
                                    commands.push({
                                        name: c.data.name,
                                        formattedName: `${c.data.name} ${option.name}`,
                                        description: option.description,
                                        category: c.category || null,
                                        commandType: c.commandType,
                                    });
                                }
                            });
                        }
                        else {
                            commands.push({
                                name: c.data.name,
                                formattedName: `${c.data.name} ${option.name}`,
                                description: option.description,
                                category: c.category || null,
                                commandType: c.commandType,
                            });
                        }
                    }
                    else {
                        commands.push({
                            name: c.data.name,
                            formattedName: `${c.data.name}`,
                            description: c.data.description,
                            category: c.category || null,
                            commandType: c.commandType,
                        });
                    }
                });
            }
            else {
                commands.push({
                    name: c.data?.name || c.name,
                    formattedName: `${c.data?.name || c.name}`,
                    description: c.data?.description || c.description,
                    category: c.category || null,
                    commandType: c.commandType,
                });
            }
        });
        return commands;
    }
    isOwner(userId) {
        if (!userId)
            throw new XernerxError('No ID specified');
        let owners = this.client.settings.ownerId;
        if (!owners)
            return false;
        if (typeof owners === 'string')
            owners = [owners];
        return owners.includes(userId);
    }
    getAllCommands() {
        const cmds = [];
        for (const commands of Object.values(this.client.commands)) {
            commands.map((cmd) => cmds.push(cmd));
        }
        return cmds;
    }
    getAllMessageCommands() {
        const cmds = [];
        this.client.commands.message.map((cmd) => cmds.push(cmd));
        return cmds;
    }
    getAllSlashCommands() {
        const cmds = [];
        this.client.commands.slash.map((cmd) => cmds.push(cmd));
        return cmds;
    }
    getAllContextCommands() {
        const cmds = [];
        this.client.commands.context.map((cmd) => cmds.push(cmd));
        return cmds;
    }
    setPresence(options) {
        const client = this.client;
        function pres() {
            client.user?.setPresence({
                activities: [
                    {
                        name: options.text || undefined,
                        type: options.type || undefined,
                        url: options.link || undefined,
                    },
                ],
                status: options.status || undefined,
            });
        }
        pres();
        if (options.interval) {
            setInterval(() => {
                pres();
            }, options.interval);
        }
    }
    getCooldowns(id, command) {
        let cooldowns = [];
        for (const [key, value] of Object.entries(this.client.cache)) {
            if (!['cooldowns', 'messageCommands', 'slashCommands', 'contextCommands', 'commands'].includes(key))
                continue;
            if (key === 'commands') {
                if (command) {
                    value.map((x) => {
                        const name = x.name.split(/-/);
                        name.pop();
                        if (name.join('-') === id + '-' + command) {
                            cooldowns.push(x);
                        }
                    });
                }
                else {
                    value.map((x) => {
                        if (x.name.split(/-/).shift() === id) {
                            cooldowns.push(x);
                        }
                    });
                }
            }
            else {
                if (value.has(id)) {
                    const x = value.get(id);
                    cooldowns.push(x);
                }
            }
        }
        return cooldowns;
    }
    getCooldownTimers(id, command) {
        let cooldowns = [];
        for (const [key, value] of Object.entries(this.client.cache)) {
            if (!['cooldowns', 'messageCommands', 'slashCommands', 'contextCommands', 'commands'].includes(key))
                continue;
            if (key === 'commands') {
                if (command) {
                    value.map((x) => {
                        const name = x.name.split(/-/);
                        name.pop();
                        if (name.join('-') === id + '-' + command) {
                            cooldowns.push({
                                [x.commandName]: x.endsAt - Date.now(),
                            });
                        }
                    });
                }
                else {
                    value.map((x) => {
                        if (x.name.split(/-/).shift() === id) {
                            cooldowns.push({
                                [x.commandName]: x.endsAt - Date.now(),
                            });
                        }
                    });
                }
            }
            else {
                if (value.has(id)) {
                    const x = value.get(id);
                    cooldowns.push({ [key]: x.endsAt - Date.now() });
                }
            }
        }
        const sort = cooldowns.map((x) => Object.entries(x).shift()).sort((a, b) => b[1] - a[1]);
        cooldowns = [];
        sort.map(([key, value]) => cooldowns.push({ [key]: value }));
        return cooldowns;
    }
    async defer(time) {
        return new Promise((resolve) => setTimeout(resolve, time || 0));
    }
}
