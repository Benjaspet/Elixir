// The slash command data for development commands, such as
// deploying base commands, sub-commands, and more.

const client = require("../Elixir");

function getAllElixirSlashCommandData() {

    return [

        {
            name: "help",
            description: "Displays a list of all available commands for Elixir."
        },

    ];

}

function getElixirDeployCommandData() {

    return {
        name: "deploy",
        description: "Deploy a specific slash command interface.",
    }

}

module.exports = {
    getAllElixirSlashCommandData, getElixirDeployCommandData
};