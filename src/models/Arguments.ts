import { ChatInputApplicationCommandData, SlashCommandBuilder } from 'discord.js';
import { ContextCommandBuilder, MessageCommandBuilder } from '../main.js';
import { XernerxMessage } from '../types/extenders.js';
import { MessageCommandArguments } from '../types/interfaces.js';
import { XernerxInteraction } from '../types/types.js';

export async function messageArguments(message: XernerxMessage, command: MessageCommandBuilder): Promise<MessageCommandArguments> {
    const separator = command.separator || ' ',
        content = message.content.split(separator).slice(1);

    let args: Record<string, unknown> | null = {},
        flags: Record<string, boolean> | null = {};

    if (command.flags)
        command.flags.map((flag) => {
            if (!flags) flags = {};

            if (content.includes(flag.match)) flags[flag.name] = true;
            else flags[flag.name] = false;

            const index = content.indexOf(flag.match);

            if (index > 0) content.splice(index, 1);
        });

    if (command.args)
        for (const argument of command.args) {
            const element = content.at(0) || null;

            if (!element) {
                if (typeof argument.default === 'function') args[argument.name] = argument.default(message);
                args[argument.name] = argument.default || null;
                continue;
            }

            if (argument.type === 'option') argument.match?.includes(element) ? (args[argument.name] = element) : (args[argument.name] = null);

            if (argument.type === 'number') args[argument.name] = parseInt(element);

            if (argument.type === 'integer') args[argument.name] = parseInt(element);

            if (argument.type === 'boolean') args[argument.name] = element === 'true' ? true : false;

            if (argument.type === 'confirm') args[argument.name] = element === 'yes' ? 'yes' : 'no';

            if (argument.type === 'string') args[argument.name] = element;

            if (argument.type === 'channel') {
                try {
                    const channel = await message.client.channels.fetch(element);

                    args[argument.name] = channel;
                } catch (e) {
                    args[argument.name] = null;
                }
            }

            if (argument.type === 'guild') {
                try {
                    const guild = await message.client.guilds.fetch(element);

                    args[argument.name] = guild;
                } catch (e) {
                    args[argument.name] = null;
                }
            }

            if (argument.type === 'mentionable') {
                (
                    await Promise.all(
                        [message.guild?.roles, message.client.users, message.client.guilds, message.client.channels, message.guild?.members, message.channel.messages].map((req) =>
                            req
                                ? req
                                      .fetch(element)
                                      .then((r) => r)
                                      .catch(() => null)
                                : null
                        )
                    )
                ).map((mentionable) => {
                    if (!args) args = {};
                    if (mentionable) return (args[argument.name] = mentionable);
                    else args[argument.name] = null;
                });
            }
            if (argument.type === 'role') {
                try {
                    const role = await message.guild?.roles.fetch(element);

                    args[argument.name] = role;
                } catch (e) {
                    args[argument.name] = null;
                }
            }
            if (argument.type === 'user') {
                try {
                    const user = await message.client.users.fetch(element);

                    args[argument.name] = user;
                } catch (e) {
                    args[argument.name] = null;
                }
            }
            if (argument.type === 'member') {
                try {
                    const member = await message.guild?.members.fetch(element);

                    args[argument.name] = member;
                } catch (e) {
                    args[argument.name] = null;
                }
            }
            if (argument.type === 'message') {
                try {
                    const msg = await message.channel?.messages.fetch(element);

                    args[argument.name] = msg;
                } catch (e) {
                    args[argument.name] = null;
                }
            }
            if (argument.type === 'list') {
                let separator = String(argument.separator) || ',';

                if (separator.startsWith('/') && separator.endsWith('/')) separator = separator.replace(/^\/|\/$/gim, '');

                const items = content.join(' ').split(new RegExp(' *' + separator + ' *', 'gi'));

                if (!argument.content) args[argument.name] = items;
                else {
                    const contents = argument.content.map((content) => content.toLowerCase()),
                        itemList: Array<string> = [];

                    items.map((item) => (contents.includes(item.toLowerCase()) ? itemList.push(argument.content?.at(contents.indexOf(item.toLowerCase())) as string) : null));

                    args[argument.name] = itemList;
                    break;
                }
            }

            if (argument.type === 'rest') {
                args[argument.name] = content.join(separator);
                break;
            }

            content.splice(0, 1);
        }

    if (!command.flags) flags = null;
    if (!command.args) args = null;

    return { args, flags };
}

export async function interactionArguments(interaction: XernerxInteraction | any, command: ContextCommandBuilder | SlashCommandBuilder) {
    const options: Record<string, string> = {};

    let args = interaction?.options?._hoistedOptions,
        group = interaction?.options?._group,
        subcommand = interaction?.options?._subcommand;

    if (interaction.options._hoistedOptions) {
        for (const option of interaction.options._hoistedOptions) {
            options[option.name] = option.member || option.channel || option.user || option.role || option.value;
        }

        args = options;
    }

    return { args, group, subcommand };
}
