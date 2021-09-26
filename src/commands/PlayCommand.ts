import * as Discord from "discord.js";
import {getData, getTracks} from "spotify-url-info";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {client, player} from "../Elixir";
import config from "../resources/Config";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import SpotifyAPIUtil from "../utils/SpotifyAPIUtil";
import ElixirUtil from "../utils/ElixirUtil";
import VoiceManager from "../managers/VoiceManager";

export default class PlayCommand implements PonjoCommand {

    public name: string = "play";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Play a song in a voice channel with a link or query.";
    public aliases: string[] = [];
    protected client: Client;

    public songManager = [];

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
                    return interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel to run this command.")]});
                }
                if (song.toLowerCase().includes("spotify") && song.toLowerCase().includes("playlist")) {
                    getTracks(song).then(async result => {
                        if (result.length > 99 && interaction.user.id !== config.guild) {
                            const embed = new Discord.MessageEmbed()
                                .setColor("PURPLE")
                                .setDescription("To avoid ratelimiting, only 100 songs can be queued at once. Therefore, only the first " +
                                    "100 songs of this playlist will be queued." + "\n\n" + "**Total songs:** " + result.length)
                                .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            await interaction.editReply({embeds: [embed]});
                            return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                        }
                        const embed = new Discord.MessageEmbed()
                            .setTitle("Searching for the playlist...")
                            .setColor("PURPLE")
                            .setDescription("Total songs: " + result.length)
                            .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                        await interaction.editReply({embeds: [embed]});
                        VoiceManager.sendFollowUp[0] = true;
                        return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                    });
                } else {
                    if (song.includes("https://open.spotify.com")) {
                        try {
                            await getData(song)
                                .then(async data => {
                                    const songName = data.name;
                                    const songUrl = data.external_urls.spotify;
                                    const artist = data.artists[0].name;
                                    const artistUrl = data.artists[0].external_urls.spotify;
                                    const embed = new Discord.MessageEmbed()
                                        .setColor("PURPLE")
                                        .setDescription(`` +
                                            `**Queued:** [${songName}](${songUrl})` + "\n" +
                                            `**Artist:** [${artist}](${artistUrl})`)
                                        .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                                        .setTimestamp()
                                    await interaction.editReply({embeds: [embed]});
                                    DatabaseUtil.addPlayedSong(1);
                                    VoiceManager.sendFollowUp[0] = false;
                                    return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                                })
                        } catch (error) {
                            console.log(error)
                            return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                    "error", "An error occurred during playback.")]});
                        }
                    } else {
                        if (song.toLowerCase().includes("youtube.com/watch")) {
                            return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                    "error", "**Official removal of YouTube support**" +
                                    "\n\n" +
                                    "Unfortunately, Elixir has officially removed support for YouTube. However, " +
                                    "you can try to find your song through another platform or by simply typing the song's name.")]});
                        } else {
                            const data = await SpotifyAPIUtil.getSpotifyTrack(song);
                            const songName = data.name ? data.name : undefined;
                            const artist = data.artist ? data.artist : undefined;
                            const artistUrl = data.artistUrl ? data.artistUrl : "https://www.spotify.com/us"
                            const url = data.trackUrl ? data.trackUrl : "https://www.spotify.com/us";
                            await ElixirUtil.sleep(1000);
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`` +
                                    `**Queued:** [${songName}](${url})` + "\n" +
                                    `**Artist:** [${artist}](${artistUrl})`)
                                .setColor("PURPLE")
                                .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            if (!songName || !artist) {
                                VoiceManager.sendFollowUp[0] = true;
                                DatabaseUtil.addPlayedSong(1);
                                await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Searching for the song...")]});
                                return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                            }
                            DatabaseUtil.addPlayedSong(1);
                            await interaction.editReply({embeds: [embed]});
                            return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                        }
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