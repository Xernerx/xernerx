const { logStyle } = require('dumfunctions');

module.exports = new class InhibitorsUtil {
    importInhibitors(client, path, files) {
        for (const file of files) {
            try {
                let filepath = `${require("path").resolve(path)}/${file}`;

                let inhibitor = require(filepath);

                inhibitor = new inhibitor;

                inhibitor.filepath = filepath;

                inhibitor.client = client;

                client.inhibitors.set(inhibitor.name, inhibitor);
            }
            catch (error) {
                console.error(logStyle(`Couldn't load ${file} because of <${error.message}>!`, "text", "red"));
            }
        }
    }
}