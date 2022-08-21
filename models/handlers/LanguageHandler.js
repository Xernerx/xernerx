const { logStyle } = require('dumfunctions');
const fs = require('fs');
const i = require('i18next');

class LanguageHandler {
    constructor(client) {
        this.client = client;

        i.init(this.client.settings.language)

        this.client.languages = []
    }

    loadAllLanguages(path, deep = true, overwrite = true) {
        let langs = [];

        const languages = fs.readdirSync(path).filter(file => file.endsWith('.json'));

        for (const file of languages) {
            const language = require(`${require("path").resolve(path)}/${file}`);

            i.addResourceBundle(file.replace('.json', ""), this.ns, language, deep, overwrite)

            this.client.languages.push(file.replace('.json', ""));

            langs.push(file.replace('.json', ""));
        }

        if (this.client.settings.logging) console.info(logStyle(`Loaded languages: ${langs.join(', ')}`, 'text', 'purple'))
    }
}

module.exports = { LanguageHandler };