const { s } = require('@sapphire/shapeshift');
const { SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, SlashCommandBuilder } = require('discord.js');
const { toTitleCase } = require('dumfunctions');

/**
 * @param {string} name - The name of the command. @required
 * @param {string} description - The brief description of the command. @required
 * @param {string} detailedDescription - The detailed description of the command.
 * @param {boolean} owner - Wether the command can be executed by the bot owner only or not.
 * @param {boolean} admin - Wether the command can be executed by the guild admins only or not.
 * @param {string} channel - Wheter the command can only be executed in a DM, a Guild, or both.
 */
class InteractionCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            description: s.string,
            info: s.string.optional,
            owner: s.boolean.optional,
            admin: s.boolean.optional,
            channel: s.string.optional,
            category: s.string.optional,
            cooldown: s.number.optional,
            ignoreOwner: s.boolean.optional,
            inVoice: s.boolean.optional
        }).parse(options);

        this.data = new SlashCommandBuilder()
            .setName(options.name)
            .setDescription(options.description)

        if (["args", "subcommands", "groups"].map(x => options[x]?.length).filter(x => x).length > 1) throw new Error("Args, subs, and groups are mutually exclusive");

        if (options?.args?.length > 0) {
            this.addOptions(this.data, options.args);
        }

        else if (options?.subs?.length > 0) {
            this.addSubcommands(this.data, options.subs);
        }

        else if (options?.groups?.length > 0) {
            this.addSubcommandGroups(options.groups)
        }

        this.id = id;

        this.owner = options.owner || false;

        this.admin = options.admin || false;

        this.channel = options.channel;

        this.category = options.category;

        this.config = options.config;

        this.cooldown = options.cooldown;

        this.ignoreOwner = options.ignoreOwner || false;

        this.inVoice = options.inVoice || false;

        this.info = options.info;
    }

    exec(interaction) {
        /*
         * Make your custom command here.
         */
    }

    addOptions(where, args) {
        const types = ["boolean", "integer", "number", "string", "user", "role", "channel", "mentionable"];

        for (const argument of args) {
            if (!types.includes(argument.type.toLowerCase())) throw new Error(`Expected one of ${types.join(', ')}, received ${argument.type} instead.`);

            where[`add${toTitleCase(argument.type, true)}Option`](option => {
                option
                    .setName(argument.name)
                    .setDescription(argument.description)
                    .setRequired(argument.required || false)
                if (argument.choices) option.setChoices(...argument?.choices);

                return option;
            })
        }
    }

    addSubcommands(where, subs) {
        for (const sub of subs) {
            let subCommand = new SlashCommandSubcommandBuilder()
                .setName(sub.name)
                .setDescription(sub.description);
            if (sub?.args?.length > 0) {
                this.addOptions(subCommand, sub.args)
            }
            where.addSubcommand(subCommand);
        }
    }

    addSubcommandGroups(groups) {
        for (const group of groups) {
            let subcommandGroup = new SlashCommandSubcommandGroupBuilder()
                .setName(group.name)
                .setDescription(group.description)

            if (group?.subs?.length > 0) {
                this.addSubcommands(subcommandGroup, group.subs)
                if (group?.subs?.args) {
                    this.addOptions(group.subs, group.subs.args)
                }
            }
            this.data.addSubcommandGroup(subcommandGroup);
        }
    }
}

module.exports = { InteractionCommand };