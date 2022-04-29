const { s } = require('@sapphire/shapeshift');
const Builders = require('@discordjs/builders');
const { toTitleCase } = require('dumfunctions');



class InteractionCommand {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            description: s.string,
            detailedDescription: s.string.optional,
            owner: s.boolean.optional,
            admin: s.boolean.optional,
            channel: s.string.optional,
        }).parse(options);

        this.data = new Builders.SlashCommandBuilder()
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
    }

    exec(interaction) {

    }

    addOptions(where, args) {
        const types = ["boolean", "integer", "number", "string", "user", "role", "channel", "mentionable"];

        for (const argument of args) {

            if (!types.includes(argument.type.toLowerCase())) throw new Error(`Expected one of ${types.join(', ')}, received ${argument.type} instead.`);

            let build = new Builders[`SlashCommand${toTitleCase(argument.type, true)}Option`];

            if (argument.options) {
                for (const [key, value] of Object.entries(argument.options)) {
                    if (key == 'choices') {
                        build[`set${toTitleCase(key, true)}`](...value);
                    }
                    else build[`set${toTitleCase(key, true)}`](value);
                }
            }

            where[`add${toTitleCase(argument.type, true)}Option`](build);
        }
    }

    addSubcommands(where, subs) {
        for (const sub of subs) {
            let subCommand = new Builders.SlashCommandSubcommandBuilder()
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
            let subcommandGroup = new Builders.SlashCommandSubcommandGroupBuilder()
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