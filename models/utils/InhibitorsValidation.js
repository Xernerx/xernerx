module.exports = new class InhibitorValidation {
    inhibitorsValidation(event, command) {
        let inhibited = {};

        if (event.client.inhibitors.has(command.runType)) {
            let inhibitor = event.client.inhibitors.get(command.runType);

            inhibited[command.runType] = inhibitor.check(event);
        }

        if (event.client.inhibitors.has("member")) {

            let inhibitor = event.client.inhibitors.get("member");

            inhibited["member"] = inhibitor.check(event, event.member);
        }

        if (event.client.inhibitors.has("guild")) {
            let inhibitor = event.client.inhibitors.get("guild");

            inhibited["guild"] = inhibitor.check(event, event.guild);
        }

        if (event.client.inhibitors.has("user")) {
            let inhibitor = event.client.inhibitors.get("user");

            inhibited["user"] = inhibitor.check(event, event.user || event.author);
        }

        if (event.client.inhibitors.has("channel")) {
            let inhibitor = event.client.inhibitors.get("channel");

            inhibited["channel"] = inhibitor.check(event);
        }

        for (const inhibit of Object.values(inhibited)) {
            if (inhibit) return inhibited;
        }
    }
}