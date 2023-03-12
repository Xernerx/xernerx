import { SlashCommandBuilder } from 'discord.js';
import XernerxClient, { ContextCommandBuilder, MessageCommandBuilder } from '../main.js';
import { FileType } from '../types/types.js';

export default async function load(client: XernerxClient, path: string, type: FileType) {
    try {
        let file = new (await import(`file://${path}`)).default();

        file.client = client;

        file.fileType = type;

        file.filePath = path;

        fileSave(client, file, type);

        return file;
    } catch (error) {
        console.error(error);
    }
}

function fileSave(client: XernerxClient, file: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder, type: FileType) {
    switch (type) {
        case 'MessageCommand':
            client.commands.message.set(file.name, file);
            break;
        case 'SlashCommand':
            client.commands.slash.set(file.name, file);
            break;
        case 'ContextCommand':
            client.commands.context.set(file.name, file);
            break;
        case 'Inhibitor':
            client.inhibitors.set(file.name, file);
            break;
        case 'Event':
            client.events.set(file.name, file);
            break;
    }
}
