import {ApplicationCommandData, Client, CommandInteraction} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../Command";

export default class HelpCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("help", {
            name: "help",
            description: "Displays a list of all available commands for Elixir.",
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
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            switch (interaction.options.getString("category")) {
                case "help-faq":
                    return void await interaction.reply({
                        embeds: [EmbedUtil.getFaqEmbed(this.client)]
                    });
                case "help-invite":
                    return void await interaction.reply({
                        embeds: [EmbedUtil.getInviteEmbed()]
                    });
                case "help-support":
                    return void await interaction.reply({
                        embeds: [EmbedUtil.getSupportServerEmbed()]
                    });
                case "help-commands":
                    return void await interaction.reply({
                        embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]
                    });
                case "help-terms":
                    return void await interaction.reply({
                        embeds: [EmbedUtil.getTermsEmbed(this.client)]
                    });
                default:
                    return void await interaction.reply({
                        embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]
                    });
            }
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}