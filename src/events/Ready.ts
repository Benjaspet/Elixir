import ElixirUtil from "../utils/ElixirUtil";
import DatabaseManager from "../managers/DatabaseManager";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await ElixirUtil.sleep(1000);
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "LISTENING", name: ElixirUtil.getTotalElixirMemberCount(client) + " users!"});
        new DatabaseManager();
    },
};