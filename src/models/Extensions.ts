import { Style } from "dumfunctions";
import { XernerxClient } from "../main.js";

export default class Extensions {
    client: XernerxClient;

    constructor(client: XernerxClient) {
        this.client = client;
    }

    async load(extensions: Array<any>, logging: boolean = false) {
        const exts: Array<any> = [];
        extensions.map(extension => {
            try {
                try {
                    this.client.extensions[extension.name] = new extension(this.client, logging);
                }
                catch {
                    extension = extension.default
                    this.client.extensions[extension.name] = new extension(this.client, logging);
                }
                finally {
                    exts.push(extension?.name || extension?.default?.name);
                }
            }
            catch (error) {
                console.error(Style.log(`Xernerx | An error occurred loading the extension ${extension?.name || extension?.default?.name}, error:<${error}>`, { color: Style.BackgroundColor.Red }))
            }
        });

        if (logging)
            console.info(Style.log(`Xernerx | Loaded ${exts.length} extensions: ${exts.join(', ')}`, { color: Style.TextColor.Cyan }));
    }
}