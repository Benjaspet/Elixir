// Function to deploy all slash commands.
// Global commands are cached for up to one hour.

const client = require("../Elixir");
const {getAllElixirSlashCommandData} = require("../slash/DevInterface");

async function deployAllSlashCommands(client, global = false) {

    if (global === false) {

        client.guilds.cache.get(client.config.developer["ponjo-test-guild"])?.commands.set(getAllElixirSlashCommandData())
            .then(response => console.log("All slash commands have been deployed to the development guild."));


    } else if (global === true) {

        client.application?.commands.set(getAllElixirSlashCommandData())
            .then(response => console.log("All slash commands have been globally deployed."));

    }

}

module.exports = {
    deployAllSlashCommands
}