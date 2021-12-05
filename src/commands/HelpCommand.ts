import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";

export default class HelpCommand implements ICommand {

    public name: string = "help";
    public description: string = "Displays a list of all available commands for Elixir.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            if (!interaction.options.get("category")) {
                return await interaction.reply({embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]});
            }
            const {value: string} = interaction.options.get("category");
            switch (string) {
                case "help-faq":
                    return await interaction.reply({embeds: [EmbedUtil.getFaqEmbed(this.client)]});
                case "help-invite":
                    return await interaction.reply({embeds: [EmbedUtil.getInviteEmbed()]});
                case "help-support":
                    return await interaction.reply({embeds: [EmbedUtil.getSupportServerEmbed()]});
                case "help-commands":
                    return await interaction.reply({embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]});
                case "help-terms":
                    return await interaction.reply({embeds: [EmbedUtil.getTermsEmbed(this.client)]});
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
                type: SlashCommandUtil.slashCommandTypeToInt("STRING"),
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
                    },
                    {
                        name: "Disclaimer, Terms, & Privacy Policy",
                        value: "help-terms"
                    }
                ]
            }
        ]
    };
}