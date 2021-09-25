import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import {getTracks} from "spotify-url-info";
import config from "../resources/Config";
import * as Discord from "discord.js";
import {player} from "../Elixir";
import SlashCommandUtil from "../utils/SlashCommandUtil";

export default class PlayCommand implements PonjoCommand {

    public name: string = "play";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Play a song in a voice channel with a link or query.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            DatabaseUtil.addExecutedCommand(1);
            try {
                const song = interaction.options.getString("song");
                const channel = interaction.member?.voice.channel;
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel to run this command.")]});
                }
                if (song.toLowerCase().includes("spotify") && song.toLowerCase().includes("playlist")) {
                    getTracks(song).then(async result => {
                        if (result.length > 35 && interaction.user.id !== config.guild) {
                            return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                    "error", "You cannot queue playlists with more than 35 songs!")]});
                        }
                        const embed = new Discord.MessageEmbed()
                            .setTitle("Searching for the playlist...")
                            .setColor("PURPLE")
                            .setDescription("Total songs: " + result.length)
                            .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                        await interaction.reply({embeds: [embed]});
                        return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                    });
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Searching the songbase...")
                        .setColor("PURPLE")
                        .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({embeds: [embed]});
                    return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                }
            } catch (error) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "error", "An error occurred during playback.")]});
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
                required: true
            }
        ],
    }
}