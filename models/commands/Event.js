const { s } = require('@sapphire/shapeshift')

/**
 * @param {String} id - The id of the event. @required
 * @param {object} options - of the event. @required
 * @param {string} name - The name of the event. @required
 * @param {boolean} once - Whether the event should be ran once or continuesly.
 */
class Event {
    constructor(id, options = {}) {
        s.object({
            name: s.string,
            once: s.boolean.optional,
            process: s.boolean.optional
        }).parse(options)

        this.name = options.name;

        this.once = options.once || false;

        this.process = options.process || false;
    }

    run(event) {
        /*
        * Make your custom event here.
        */
    }
}

module.exports = { Event };