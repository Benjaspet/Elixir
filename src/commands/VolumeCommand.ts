import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import ElixirUtil from "../utils/ElixirUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";

export default class VolumeCommand implements PonjoCommand {

    public name: string = "volume";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Amplify or lower the music volume.";
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
                const volume = interaction.options.getNumber("amplifier");
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "There is no queue for the server.")]});
                }
                await interaction.deferReply();
                await ElixirUtil.sleep(1000);
                await player.setVolume(interaction.guild.id, volume);
                return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "default", "Successfully set the volume to **" + volume + "**.")]});
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
                name: "amplifier",
                description: "The volume amplifier.",
                type: SlashCommandUtil.slashCommandTypeToInt("NUMBER"),
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
    };
}