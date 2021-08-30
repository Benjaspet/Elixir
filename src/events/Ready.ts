import config from "../resources/Config";
import elixirSlashCommandData from "../slash/SlashDataUtil";
import ElixirUtil from "../utils/ElixirUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        await ElixirUtil.sleep(500)
            .then(result => {
                console.clear();
                console.log(`✔ ${client.user.tag} logged in.`);
                client.user.setActivity({type: "LISTENING", name: ElixirUtil.getTotalElixirMemberCount(client) + " users!"});
            });

        if (config.developer.deploySlashCommands === true) {

            client.guilds.cache.get(config.developer.developerGuild)?.commands.set(elixirSlashCommandData)
                .then(response => console.log("All slash commands have been deployed to the development guild."));
        }

    },
};