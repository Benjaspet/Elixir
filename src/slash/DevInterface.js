// The slash command data for development commands, such as
// deploying base commands, sub-commands, and more.

const client = require("../Elixir");

function getDevelopmentSlashCommandData() {

    return [

        {
            name: "deploy",
            description: "Deploy a specific slash command interface.",
            options: [{
                name: "branch",
                type: "STRING",
                description: "The branch of slash commands to deploy.",
                required: true,
                choices: [
                    {
                        name: "Global Commands",
                        value: "elixir-slash-global",
                    },
                    {
                        name: "Global Sub-Commands",
                        value: "elixir-sub-global",
                    },
                    {
                        name: "Development Commands",
                        value: "elixir-slash-dev",
                    },
                    {
                        name: "Development Sub-Commands",
                        value: "elixir-sub-dev",
                    }
                ],
            }],
        }
    ];

}

async function registerElixirDevDeployCommand() {
    await client.guilds.cache.get(client.config.developer["ponjo-test-guild"])?.commands.set(client.dev.getDevelopmentSlashCommandData());
}

async function registerElixirDevSlashCommands() {
    await client.guilds.cache.get(client.config.developer["ponjo-test-guild"])?.commands.set(client.slash.getAllElixirSlashData());
}

module.exports = {
    getDevelopmentSlashCommandData,
    registerElixirDevSlashCommands,
    registerElixirDevDeployCommand
}