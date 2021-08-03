// The slash command data for development commands, such as
// deploying base commands, sub-commands, and more.

const client = require("../Elixir");

function getAllElixirSlashCommandData() {

    return [

        {
            name: "deploy",
            description: "Deploy all slash commands to this guild.",
        },
        {
            name: "help",
            description: "Displays a list of all available commands for Elixir."
        },
        {
            name: "play",
            description: "Play a song in a voice channel with a link or query.",
            options: [
                {
                    name: "song",
                    description: "The name or URL of the song.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "skip",
                    description: "Whether or not you want to skip to this song.",
                    type: "BOOLEAN",
                    required: false
                }
            ],
        },
        {
            name: "queue",
            description: "View all songs in the queue.",
        },
        {
            name: "skip",
            description: "Skip to the next song in the queue.",
        },
        {
            name: "invite",
            description: "Invite Elixir to your server."
        },
        {
            name: "shuffle",
            description: "Shuffle the order of queued songs."
        }
    ];

}

function getGlobalElixirSlashCommandData() {

}

module.exports = {
    getAllElixirSlashCommandData, getGlobalElixirSlashCommandData
};