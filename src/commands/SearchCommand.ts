import {Client, MessageEmbed} from "discord.js";
import {player} from "../Elixir";
import {ICommand} from "../interfaces/ICommand";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Logger from "../Logger";
import PlayCommand from "./PlayCommand";

export default class SearchCommand implements ICommand {

    public name: string = "search";
    public description: string = "Search for a specific song.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                await interaction.deferReply();
                await DatabaseUtil.addExecutedCommand(1);
                const channel = interaction.member?.voice.channel;
                const song = interaction.options.getString("song");
                if (!channel) {
                    return interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]});
                }
                await PlayCommand.followUp.set(interaction.guild.id, true);
                const embed = new MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription("Searching for the song...")
                await interaction.editReply({embeds: [embed]});
                return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
            } catch (error) {
                Logger.error(error);
                return await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("An error ocurred.")]});
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
                name: "song",
                description: "The URL or song query.",
                type: SlashCommandUtil.slashCommandTypeToInt("STRING"),
                required: true,
                autocomplete: true
            }
        ],
    }
}