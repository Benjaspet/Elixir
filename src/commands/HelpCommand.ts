import {Client, CommandInteraction} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";

export default class HelpCommand implements ICommand {

    public name: string = "help";
    public description: string = "Displays a list of all available commands for Elixir.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            switch (interaction.options.getString("category")) {
                case "help-faq":
                    return void await interaction.reply({embeds: [EmbedUtil.getFaqEmbed(this.client)]});
                case "help-invite":
                    return void await interaction.reply({embeds: [EmbedUtil.getInviteEmbed()]});
                case "help-support":
                    return void await interaction.reply({embeds: [EmbedUtil.getSupportServerEmbed()]});
                case "help-commands":
                    return void await interaction.reply({embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]});
                case "help-terms":
                    return void await interaction.reply({embeds: [EmbedUtil.getTermsEmbed(this.client)]});
                default:
                    return void await interaction.reply({embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]});
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
                type: ApplicationCommandOptionTypes.STRING,
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