// The slash command data for development commands, such as
// deploying base commands, sub-commands, and more.

const client = require("../Elixir");

function getAllElixirSlashCommandData() {

    return [

        {
            name: "deploy",
            description: "Deploy all slash commands to this guild.",
            options: [
                {
                    name: "variant",
                    description: "The slash command variant to deploy.",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "Global Deploy",
                            value: "deploy-global"
                        },
                        {
                            name: "Guild Deploy",
                            value: "deploy-guild"
                        }
                    ]
                }
            ]
        },
        {
            name: "help",
            description: "Displays a list of all available commands for Elixir.",
            options: [
                {
                    name: "category",
                    description: "Learn how to use Elixir and its commands.",
                    type: "STRING",
                    required: false,
                    choices: [
                        {
                            name: "Frequently Asked Questions",
                            value: "help-faq"
                        },
                        {
                            name: "How to Invite Elixir to Your Server",
                            value: "help-invite"
                        },
                        {
                            name: "Join Elixir's Support Server",
                            value: "help-support"
                        },
                        {
                            name: "How to Use Commands",
                            value: "help-commands"
                        }
                    ]
                }
            ]
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
        },
        {
            name: "pause",
            description: "Pause the currently playing song."
        },
        {
            name: "info",
            description: "View information about Elixir."
        },
        {
            name: "filter",
            description: "Set the audio filter for the queue.",
            options: [{
                name: "type",
                type: "STRING",
                description: "Choose the type of audio filter to apply.",
                required: true,
                choices: [
                    {
                        name: "Clear all filters.",
                        value: "clear"
                    },
                    {
                        name: "Lowbass",
                        value: "lowbass"
                    },
                    {
                        name: "Bass-BOOST",
                        value: "baseboost"
                    },
                    {
                        name: "Pure-Bass",
                        value: "purebass"
                    },
                    {
                        name: "8-Dimensional",
                        value: "8D"
                    },
                    {
                        name: "Vaporwave",
                        value: "vaporwave"
                    },
                    {
                        name: "Nightcore",
                        value: "nightcore"
                    },
                    {
                        name: "Phaser",
                        value: "phaser"
                    },
                    {
                        name: "Tremolo",
                        value: "tremolo"
                    },
                    {
                        name: "Vibrato",
                        value: "vibrato"
                    },
                    {
                        name: "Reverse",
                        value: "reverse"
                    },
                    {
                        name: "Treble",
                        value: "treble"
                    }
                ]
            }]
        }
    ];

}

function getGlobalElixirSlashCommandData() {

}

module.exports = {
    getAllElixirSlashCommandData, getGlobalElixirSlashCommandData
};