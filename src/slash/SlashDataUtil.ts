const elixirSlashCommandData = [
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
                ],
            }
        ],
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
            }
        ],
    },
    {
        name: "queue",
        description: "View all songs in the queue.",
    },
    {
        name: "join",
        description: "Have Elixir join the voice channel."
    },
    {
        name: "skip",
        description: "Skip to the next song in the queue."
    },
    {
        name: "stop",
        description: "Stop the queue & remove Elixir from the voice channel."
    },
    {
        name: "shuffle",
        description: "Shuffle the order of the songs in the queue."
    },
    {
        name: "info",
        description: "View Elixir's information & statistics."
    },
    {
        name: "nowplaying",
        description: "View information about the song currently playing."
    },
    {
        name: "pause",
        description: "Pause the current song."
    },
    {
        name: "resume",
        description: "Resume the current song."
    },
    {
        name: "filter",
        description: "Add or remove filters to songs.",
        options: [
            {
                name: "type",
                description: "The type of filter to apply.",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "Remove All Filters",
                        value: "remove-all"
                    },
                    {
                        name: "Clear",
                        value: "clear"
                    },
                    {
                        name: "Lowbass",
                        value: "lowbass"
                    },
                    {
                        name: "Bassboost",
                        value: "bassboost"
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
                        name: "Reverse",
                        value: "reverse"
                    },
                    {
                        name: "Vibrato",
                        value: "vibrato"
                    },
                    {
                        name: "Nightcore",
                        value: "nightcore"
                    },
                    {
                        name: "Treble",
                        value: "treble"
                    }
                ]
            }
        ]
    },
    {
        name: "volume",
        description: "Amplify or lower the music volume.",
        options: [
            {
                name: "amplifier",
                description: "The volume amplifier.",
                type: "NUMBER",
                required: true,
                choices: [
                    {
                        name: "200",
                        value: 200
                    },
                    {
                        name: "150",
                        value: 150
                    },
                    {
                        name: "125",
                        value: 125
                    },
                    {
                        name: "75",
                        value: 75
                    },
                    {
                        name: "50",
                        value: 50
                    },
                    {
                        name: "25",
                        value: 25
                    }
                ]
            }
        ]
    }
];

export default elixirSlashCommandData;