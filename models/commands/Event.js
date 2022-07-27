const { s } = require('@sapphire/shapeshift')

/**
 * @param {String} id - The id of the event. @required
 * @param {object} options - of the event. @required
 * @param {string} name - The name of the event. @required
 * @param {boolean} once - Whether the event should be ran once or continuously.
 */
class Event {
    constructor(id, options = {}) {
        s.object({
            name: s.string,
            once: s.boolean.optional,
            type: s.string.optional
        }).parse(options)

        this.name = options.name;

        this.once = options.once || false;

        this.type = options.type || 'client';

        this.config = options.config;
    }

    run(event) {
        /*
        * Make your custom event here.
        */
    }
}

module.exports = { Event };