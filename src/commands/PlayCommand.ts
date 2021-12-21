import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {QueryType, Queue, Track, TrackSource} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../Logger";
import playdl from "play-dl";
import MusicPlayer from "../utils/MusicPlayer";
import DatabaseUtil from "../utils/DatabaseUtil";

export default class PlayCommand implements ICommand {

    public name: string = "play";
    public description: string = "Play a song in a voice channel with a link or query.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const track = interaction.options.getString("song");
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    } else {
                        const searchResult = await player.search(track, {requestedBy: interaction.user, searchEngine: QueryType.AUTO});
                        if (!searchResult || !searchResult.tracks.length) {
                            const embed = EmbedUtil.getErrorEmbed("No results found.");
                            return await interaction.reply({embeds: [embed]});
                        }
                        const embed = EmbedUtil.getDefaultEmbed("Searching for the track...");
                        await interaction.reply({embeds: [embed]});
                        const queue = await player.createQueue(interaction.guild, {
                            metadata: {
                                channel: interaction.channel
                            },
                            bufferingTimeout: 500,
                            disableVolume: false,
                            leaveOnEnd: true,
                            leaveOnStop: true,
                            leaveOnEmpty: false,
                            leaveOnEmptyCooldown: 30000,
                            async onBeforeCreateStream(track: Track, source: TrackSource, _queue: Queue) {
                                let vid;
                                try {
                                    if (track.url.includes("youtube.com")) {
                                        vid = (await playdl.stream(track.url)).stream;
                                    } else {
                                        vid = (await playdl.stream(
                                            await playdl.search(`${track.author} ${track.title} lyric`, {
                                                limit: 1,
                                                source: {
                                                    youtube: "video"
                                                }
                                            }).then(x => x[0].url))).stream;
                                    }
                                } catch {
                                    const embed = EmbedUtil.getErrorEmbed("An error ocurred while attempting to play that track.");
                                    vid = (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", {quality: 0})).stream;
                                    return await interaction.reply({embeds: [embed]});
                                }
                                return vid;
                            }
                        });
                        let justConnected;
                        try {
                            if (!queue.connection) {
                                justConnected = true;
                                await queue.connect(member.voice.channel);
                            }
                        } catch {
                            const embed = EmbedUtil.getErrorEmbed("Unable to join your voice channel.");
                            await player.deleteQueue(interaction.guild);
                            return await interaction.reply({embeds: [embed]});
                        }
                        if (searchResult.playlist) {
                            searchResult.tracks[0].playlist = searchResult.playlist;
                            await DatabaseUtil.addPlaylistPlayed(1);
                        }
                        await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
                        if (justConnected) queue.play();
                        await DatabaseUtil.addPlayedSong(1);
                        MusicPlayer.setPlaying(queue, true);
                    }
                }
            } catch (error: any) {
                Logger.error(error);
                const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
                return await interaction.reply({embeds: [embed]});
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
                type: ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ],
    }
}