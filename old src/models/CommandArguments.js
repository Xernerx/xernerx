export class InteractionArguments {
    interaction;
    constructor(interaction) {
        this.interaction = interaction;
    }
    group() {
        return this.interaction?.options?._group;
    }
    subcommand() {
        return this.interaction?.options?._subcommand;
    }
    arguments() {
        const options = {};
        if (this.interaction?.options?._hoistedOptions) {
            for (const option of this.interaction.options._hoistedOptions) {
                options[option.name] = option.channel || option.user || option.role || option.value;
            }
        }
        return options;
    }
}
export async function messageArguments(message, command) {
    let args = { flags: {} }, separator = command.separator || ' ', i = 0;
    if (!command.args)
        return;
    command.args
        .filter((c) => c.type == 'flag')
        .map((flag) => {
        args = args;
        for (const flg of message.content.matchAll(flag.match)) {
            if (flag.match == flg) {
                message.content = message.content.replace(flag.match, '');
                args.flags[flag.name] = true;
            }
        }
        if (!args.flags[flag.name])
            args.flags[flag.name] = false;
    });
    for (const argument of command.args) {
        args = args;
        let content = message.content
            .split(/ +/)
            .slice(1)
            .join(separator)
            .replace(new RegExp(`${separator}${separator}+`, 'g'), separator)
            .split(separator)
            .slice(i);
        if (content.join(separator) != '' && argument.type !== 'flag') {
            if (argument?.content?.includes(content[0])) {
                args[argument.name] = content[0];
            }
            else if (argument.type == 'string') {
                args[argument.name] = content[0];
            }
            else if (argument.type == 'number') {
                args[argument.name] = parseInt(content[0]);
            }
            else if (argument.type == 'boolean') {
                if (content[0]?.toLowerCase() != 'true' && content[0]?.toLowerCase() != 'false')
                    content[0] = null;
                args[argument.name] = content[0];
            }
            else if (argument.type == 'user') {
                let user = message.client.users.cache.find((u) => u?.username?.toLowerCase()?.includes(content[0])) || null;
                try {
                    user = (await message.client.users.fetch(user?.id || content[0].replace(/<@!?|>/g, ''))) || null;
                }
                catch (e) {
                    user = null;
                }
                args[argument.name] = user;
            }
            else if (argument.type == 'role') {
                let role = message.guild?.roles.cache.find((r) => r?.name?.toLowerCase()?.includes(content[0])) || null;
                try {
                    role = (await message.guild?.roles.fetch(role?.id || content[0].replace(/<@&?|>/g, ''))) || null;
                }
                catch (e) {
                    role = null;
                }
                args[argument.name] = role;
            }
            else if (argument.type == 'member') {
                let member = message.guild?.members.cache.find((m) => m?.nickname?.toLowerCase()?.includes(content[0]) || m?.user?.username?.toLowerCase()?.includes(content[0])) || null;
                try {
                    member = (await message.guild?.members.fetch(member?.id || content[0].replace(/<@!?|>/g, ''))) || null;
                }
                catch (e) {
                    member = null;
                }
                args[argument.name] = member;
            }
            else if (argument.type == 'channel') {
                let channel = message.guild?.channels.cache.find((c) => c?.name?.toLowerCase()?.includes(content[0]));
                try {
                    channel = await message.client.channels.fetch(channel?.id || content[0].replace(/<#|>/g, ''));
                }
                catch (e) {
                    channel = null;
                }
                args[argument.name] = channel;
            }
            else if (argument.type == 'rest') {
                args[argument.name] = content.join(separator);
                break;
            }
            else if (argument.prompt) {
                if (argument.prompt.reply)
                    return message.util?.reply(argument.prompt.reply);
                else if (argument.prompt.send)
                    return message.channel.send(argument.prompt.send);
            }
            else
                args[argument.name] = typeof argument.default == 'function' ? argument.default(message) : argument.default;
            i++;
        }
        else
            args[argument.name] = typeof argument.default == 'function' ? argument.default(message) : argument.default;
    }
    return args;
}
