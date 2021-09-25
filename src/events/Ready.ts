import SlashCommandManager from "../managers/SlashCommandManager";
import ElixirUtil from "../utils/ElixirUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "LISTENING", name: ElixirUtil.getTotalElixirMemberCount(client) + " users!"});
        await new SlashCommandManager(client).deleteAllSlashCommands(client, false);
    },
};