const colors = require('./colors.json');

/**
 * @param {object} Functions - Build in functions of the bot hidden away in the handlers/setters.
 */
class Functions {
    /**
     * 
     * @param {object} client - Client object.
     * @param {object} options - Client options.   
     * @returns an object of default colors and custom colors to be imported anywhere without having to import them.
     */
    color({ client: client, options: options }) {
        client.color = { FLAGS: colors }

        if (options.color) {
            for (const [name, color] of Object.entries(options.color)) {
                client.color[name] = color;
            }
        }

        return client.color;
    }

    /**
     * 
     * @param {object} client - Client object.
     * @param {object} options - Client options. 
     * @returns custom config settings for the bot.
     */
    config({ client: client, options: options }) {
        client.config = {}

        if (options.config) {
            for (const [key, value] of Object.entries(options.config)) {
                client.config[key] = value;
            }
        }

        return client.config;
    }
}

module.exports = new Functions();