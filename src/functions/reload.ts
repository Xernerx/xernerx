import InhibitorBuilder from '../build/InhibitorBuilder.js';
import XernerxClient, { Collection, ContextCommandBuilder, EventBuilder, MessageCommandBuilder, SlashCommandBuilder } from '../main.js';

export default function reload(
    client: XernerxClient,
    commands: Array<MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder | EventBuilder | InhibitorBuilder>,
    type: 'message' | 'slash' | 'context' | 'event' | 'inhibitor'
) {
    const cmds: Array<string> = [];

    if (type === 'message' || type === 'slash' || type === 'context') {
        for (const cmd of client.commands[type]) {
            console.log('filepath' in cmd);
        }
    }
}
