const Handler = require("./Handler");
const Discord = require('discord.js');

module.exports = class InhibitorHandler {
    constructor(client) {
        this.client = client;

        client.inhibitors = new Discord.Collection();

        this.load = new Handler(client);
    }

    loadAllInhibitors(path) {
        this.load.loadAllInhibitors(path);
    }
}