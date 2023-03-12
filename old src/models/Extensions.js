import { Style } from 'dumfunctions';
export default class Extensions {
    client;
    constructor(client) {
        this.client = client;
    }
    async load(extensions, logging = false) {
        const exts = [];
        extensions.map((extension) => {
            try {
                this.client.extensions[extension.name] = extension;
                exts.push(extension.name);
            }
            catch (error) {
                console.error(Style.log(`Xernerx | An error occurred trying to load ${extension.name}, error: <${error}>`, {
                    color: Style.BackgroundColor.Red,
                }));
            }
        });
        if (logging)
            console.info(Style.log(`Xernerx | Loaded ${exts.length} extensions: ${exts.join(', ')}`, { color: Style.TextColor.Cyan }));
    }
}
