import * as Discord from "discord.js";
import {getData, getTracks} from "spotify-url-info";
import {Client, Collection, Snowflake} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Util from "../utils/Util";
import SpotifyAPIUtil from "../utils/SpotifyAPIUtil";
import Logger from "../Logger";
import Config from "../Config";

export default class PlayCommand implements ICommand {

    public name: string = "play";
    public description: string = "Play a song in a voice channel with a link or query.";
    private readonly client: Client;
    public static followUp: Collection<Snowflake, boolean> = new Collection<Snowflake, boolean>();

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            await interaction.deferReply();
            const song = interaction.options.getString("song");
            const channel = interaction.member?.voice.channel;
            if (!channel) return interaction.editReply({
                embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]
            });
            try {
                await DatabaseUtil.addExecutedCommand(1);
                if (song.toLowerCase().includes("spotify") && song.toLowerCase().includes("playlist")) {
                    getTracks(song).then(async result => {
                        if (result.length > 99 && interaction.user.id !== Config.get("GUILD-ID")) {
                            const embed = new Discord.MessageEmbed()
                                .setColor("PURPLE")
                                .setDescription("To avoid ratelimiting, only 100 songs can be queued at once. Therefore, only the first " +
                                    "100 songs of this playlist will be queued." + "\n\n" + "**Total songs:** " + result.length)
                                .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            await PlayCommand.followUp.set(interaction.guild.id, false);
                            await interaction.editReply({embeds: [embed]});
                            return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setTitle("Searching for the playlist...")
                                .setColor("PURPLE")
                                .setDescription("Total songs: " + result.length)
                                .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            await PlayCommand.followUp.set(interaction.guild.id, false);
                            await interaction.editReply({embeds: [embed]});
                            return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                        }
                    });
                } else if (song.includes("https://open.spotify.com")) {
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
                            await PlayCommand.followUp.set(interaction.guild.id, false);
                            await interaction.editReply({embeds: [embed]});
                            await DatabaseUtil.addPlayedSong(1);
                            return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                        })
                } else if (song.toLowerCase().includes("youtube.com/watch")) {
                    const embed2 = new Discord.MessageEmbed()
                        .setDescription("Searching for the song...")
                        .setColor("PURPLE")
                        .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await PlayCommand.followUp.set(interaction.guild.id, true);
                    await interaction.editReply({embeds: [embed2]});
                    return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                } else {
                    const data = await SpotifyAPIUtil.getSpotifyTrack(song);
                    const songName = data.name ? data.name : undefined;
                    const artist = data.artist ? data.artist : undefined;
                    const artistUrl = data.artistUrl ? data.artistUrl : "https://www.spotify.com/us"
                    const url = data.trackUrl ? data.trackUrl : "https://www.spotify.com/us";
                    await Util.sleep(1000);
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`` +
                            `**Queued:** [${songName}](${url})` + "\n" +
                            `**Artist:** [${artist}](${artistUrl})`)
                        .setColor("PURPLE")
                        .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    if (!songName || !artist) {
                        await DatabaseUtil.addPlayedSong(1);
                        return await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("Cannot play that song.")]});
                    }
                    await PlayCommand.followUp.set(interaction.guild.id, false);
                    await DatabaseUtil.addPlayedSong(1);
                    await interaction.editReply({embeds: [embed]});
                    return await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});
                }
            } catch (error) {
                Logger.error(error);
                return await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("An error occurred during playback.")]});
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