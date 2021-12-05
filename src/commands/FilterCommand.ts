import {Client} from "discord.js";
import {player} from "../Elixir";
import {ICommand} from "../interfaces/ICommand";
import EmbedUtil from "../utils/EmbedUtil";
import Util from "../utils/Util";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Logger from "../Logger";

export default class FilterCommand implements ICommand {

    public name: string = "filter";
    public description: string = "Add or remove filters to songs.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                const filter = interaction.options.getString("type");
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There is no queue for the server.")]});
                }
                await interaction.deferReply();
                await Util.sleep(2000);
                if (filter === "remove-all") {
                    player.setFilter(interaction.guild.id, false, true);
                    return await interaction.editReply({embeds: [EmbedUtil.getDefaultEmbed("Successfully removed all filters.")]});
                }
                player.setFilter(interaction.guild.id, filter);
                return await interaction.editReply({embeds: [EmbedUtil.getDefaultEmbed("Successfully set the filter to **" + filter + "**.")]});
            } catch (error) {
                Logger.error(error)
                return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("An error occurred while running this command.")]});
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
                name: "type",
                description: "The type of filter to apply.",
                type: SlashCommandUtil.slashCommandTypeToInt("STRING"),
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
    };
}