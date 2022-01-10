import {PlayerOptions, Queue, Track, TrackSource} from "discord-player";
import {Collection, CommandInteraction, PermissionResolvable, Snowflake} from "discord.js";
import playdl from "play-dl";
import EmbedUtil from "./EmbedUtil";

export default class MusicPlayer {

    public static playing: Collection<Snowflake, boolean> = new Collection<Snowflake, boolean>();
    public static streamCount: number = 0;

    /**
     * Get the music player init options.
     * @return PlayerOptions
     */

    public static getOptions(): PlayerOptions {
        return {
            autoSelfDeaf: true,
            bufferingTimeout: 500,
            initialVolume: 100,
            leaveOnEnd: true,
            leaveOnStop: false,
            leaveOnEmpty: false,
            spotifyBridge: true
        }
    }

    /**
     * Get the bot's queue options.
     * @param interaction
     * @return PlayerOptions|any
     */

    public static getQueueInitOptions(interaction: CommandInteraction): PlayerOptions|any {
        return {
            metadata: {
                channel: interaction.channel
            },
            ytdlOptions: {
                quality: "lowestaudio",
                filter: "audioonly",
                highWaterMark: 1 << 25
            },
            disableVolume: false,
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: false,
            leaveOnEmptyCooldown: 30000,
            async onBeforeCreateStream(track: Track, source: TrackSource, _queue: Queue) {
                let video: any;
                try {
                    if (track.url.includes("youtube.com")) {
                        video = (await playdl.stream(track.url)).stream;
                    } else {
                        video = (await playdl.stream(
                            await playdl.search(`${track.author} ${track.title} lyric`, {
                                limit: 2,
                                source: { youtube: "video" },
                        }).then(res => res[0].url))).stream;
                    }
                } catch (error: any) {
                    const embed = EmbedUtil.getErrorEmbed("An error occurred while attempting to play that track.");
                    video = (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", {quality: 0})).stream;
                    return await interaction.reply({embeds: [embed]});
                }
                return video;
            }
        }
    }

    public static setPlaying(queue: Queue, value: boolean): void {
        this.playing.set(queue.guild.id, value);
    }

    public static isPlaying(queue: Queue): boolean {
        return this.playing.get(queue.guild.id);
    }

    /**
     * Get the amount of ongoing streams.
     * @return number
     */

    public static getOngoingStreamCount(): number {
        return this.streamCount;
    }
}