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
];

export default elixirSlashCommandData;