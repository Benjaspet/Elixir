import ElixirUtil from "../utils/ElixirUtil";
import DatabaseManager from "../managers/DatabaseManager";
import SlashCommandManager from "../managers/SlashCommandManager";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await ElixirUtil.sleep(1000);
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "LISTENING", name: ElixirUtil.getTotalElixirMemberCount(client) + " users!"});
        new DatabaseManager();
        await new SlashCommandManager(client).updateAllSlashCommands(client, true);
    },
};