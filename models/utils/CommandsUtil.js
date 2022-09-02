const { logStyle } = require("dumfunctions");

module.exports = new class CommandsUtil {
    importCommands(client, path, files, commands, type) {
        for (const file of files) {
            try {
                let filepath = `${require("path").resolve(path)}/${file}`;

                let command = require(filepath);

                command = new command;

                command.filepath = filepath;

                command.runType = type;

                command.client = client;

                if (type !== 'message') {
                    commands.push(command.data.toJSON());

                    client.commands[type].set(command.data.name, command);
                }

                if (type === 'message') {
                    client.commands[type].set(command.name, command);
                }
            }
            catch (error) {
                console.error(logStyle(`Couldn't load ${file} because of <${error.message}>!`, "text", "red"));
            }
        }

        return commands;
    }

    reimportCommands(client, cmds, type) {
        let commands = [];

        client.commands[type].map(command => { if (!commands.includes(command.filepath)) commands.push(command.filepath) });

        client.commands[type].sweep(() => true);

        commands.map(path => {
            delete require.cache[require.resolve(path)];

            let command = require(path);

            command = new command;

            command.filepath = path;

            command.runType = type;

            command.client = client;

            if (type !== 'message') {
                cmds.push(command.data.toJSON());

                client.commands[type].set(command.data.name, command);
            }

            if (type === 'message') {
                client.commands[type].set(command.name, command);
            }
        })

        return commands;
    }
}