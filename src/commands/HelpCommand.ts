import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";

export default class HelpCommand implements PonjoCommand {

    public name: string = "help";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Displays a list of all available commands for Elixir.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
        DatabaseUtil.addExecutedCommand(1);
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            if (!interaction.options.get("category")) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "help-default")]});
            }
            const {value: string} = interaction.options.get("category");
            switch (string) {
                case "help-faq":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "help-faq")]});
                case "help-invite":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "help-invite")]});
                case "help-support":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "help-support")]});
                case "help-commands":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "help-default")]});
            }
        }
    }

    public getSlashData(): object {
        return this.slashData;
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
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
    };
}