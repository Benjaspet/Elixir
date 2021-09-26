import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import {getTracks} from "spotify-url-info";
import config from "../resources/Config";
import * as Discord from "discord.js";
import {client, player} from "../Elixir";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import SpotifyAPIUtil from "../utils/SpotifyAPIUtil";
import ElixirUtil from "../utils/ElixirUtil";
import {getPreview} from "spotify-url-info";

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
                await interaction.deferReply();
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
                        await interaction.editReply({embeds: [embed]});
                        return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                    });
                } else {
                    if (song.includes("https://open.spotify.com")) {
                        try {
                            await getPreview(song)
                                .then(async data => {
                                    const songName = data.track;
                                    const artistUrl = "https://spotify.com";
                                    const artist = data.artist;
                                    const songUrl = data.link;
                                    const embed = new Discord.MessageEmbed()
                                        .setColor("PURPLE")
                                        .setDescription(`` +
                                            `**Queued:** [${songName}](${songUrl})` + "\n" +
                                            `**Artist:** [${artist}](${artistUrl})`)
                                        .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                                        .setTimestamp()
                                    await interaction.editReply({embeds: [embed]});
                                    DatabaseUtil.addPlayedSong(1);
                                    return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                                });
                        } catch (error) {
                            console.log(error)
                            return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                    "error", "An error occurred during playback.")]});
                        }
                    } else {
                        const data = await SpotifyAPIUtil.getSpotifyTrack(song);
                        const songName = data.name ? data.name : song.name;
                        const artist = data.artist ? data.artist : song.uploader.name;
                        const artistUrl = data.artistUrl ? data.artistUrl : "https://www.spotify.com/us"
                        const url = data.trackUrl ? data.trackUrl : "https://www.spotify.com/us";
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`` +
                                `**Queued:** [${songName}](${url})` + "\n" +
                                `**Artist:** [${artist}](${artistUrl})`)
                            .setColor("PURPLE")
                            .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                        await interaction.editReply({embeds: [embed]});
                        DatabaseUtil.addPlayedSong(1);
                        return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                    }
                }
            } catch (error) {
                console.log(error)
                return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
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