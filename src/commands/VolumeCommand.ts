import {Client} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import Util from "../utils/Util";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Logger from "../Logger";

export default class VolumeCommand implements ICommand {

    public name: string = "volume";
    public description: string = "Amplify or lower the music volume.";
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
                const volume = interaction.options.getNumber("amplifier");
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There is no queue for the server.")]});
                }
                await interaction.deferReply();
                await Util.sleep(1000);
                await player.setVolume(interaction.guild.id, volume);
                return await interaction.editReply({embeds: [EmbedUtil.getDefaultEmbed("Successfully set the volume to **" + volume + "**.")]});
            } catch (error) {
                Logger.error(error);
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