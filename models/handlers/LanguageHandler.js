const fs = require('fs');
const i = require('i18next');

class LanguageHandler {
    constructor({ client, lang, fallbackLang, ns }) {
        this.client = client;

        this.lang = lang;

        this.fallbackLang = fallbackLang;

        this.ns = ns;

        i.init({
            lng: lang,
            fallbackLng: fallbackLang,
            ns: ns
        })

        this.client.languages = []
    }

    loadLanguages({ path, resources = true, deep = true }) {
        const languages = fs.readdirSync(path).filter(file => file.endsWith('.json'));

        for (const file of languages) {
            const language = require(`${require("path").resolve(path)}/${file}`);

            i.addResourceBundle(
                file.replace('.json', ""),
                this.ns,
                language,
                resources,
                deep
            )

            this.client.languages.push(file.replace('.json', ""));
        }
    }
}

module.exports = { LanguageHandler };