const client = require("../Elixir");
const {getAllElixirSlashCommandData, getGlobalElixirSlashCommandData} = require("../slash/DevInterface");

client.on("ready", () => {

    client.user.setActivity({type: "LISTENING", name: "your songs!"});
    console.clear();
    console.log(`✔ ${client.user.tag} logged in.`);

    if (client.config.developer["deploy-guild-slash-commands"] === true) {

        client.guilds.cache.get(client.config.developer["ponjo-test-guild"])?.commands.set(getAllElixirSlashCommandData())
            .then(response => console.log("All slash commands have been deployed to the development guild."));

    }

});