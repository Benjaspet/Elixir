const client = require("../Elixir");
const {getAllElixirSlashCommandData, getElixirDeployCommandData} = require("../slash/DevInterface");

client.on("ready", () => {

    console.log(`✔ ${client.user.tag} logged in.`);
    client.user.setActivity({type: "LISTENING", name: "your songs!"});

    if (client.config.developer["deploy-guild-slash-commands"] === true) {

        client.guilds.cache.get(client.config.developer["ponjo-test-guild"])?.commands.set(getAllElixirSlashCommandData())
            .then(response => console.log("All slash commands have been deployed to the development guild."));

    }

    if (client.config.developer["register-deploy-command"] === true) {

        client.guilds.cache.get(client.config.developer["ponjo-test-guild"])?.commands.create(getElixirDeployCommandData())
            .then(response => console.log("The deploy slash command has been cached to the development guild."));

    }

});