import {Client} from "discord.js";
import {player} from "../Elixir";
import {Command} from "../interfaces/Command";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import ElixirUtil from "../utils/ElixirUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";

export default class FilterCommand implements Command {

    public name: string = "filter";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Add or remove filters to songs.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                DatabaseUtil.addExecutedCommand(1);
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                const filter = interaction.options.getString("type");
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "There is no queue for the server.")]});
                }
                await interaction.deferReply();
                await ElixirUtil.sleep(2000);
                if (filter === "remove-all") {
                    player.setFilter(interaction.guild.id, false, true);
                    return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "default", "Successfully removed all filters.")]});
                }
                player.setFilter(interaction.guild.id, filter);
                return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "default", "Successfully set the filter to **" + filter + "**.")]});
            } catch (error) {
                console.log(error)
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "error", "An error occurred while running this command.")]});
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