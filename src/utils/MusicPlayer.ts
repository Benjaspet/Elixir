import {PlayerOptions, Queue, Track, TrackSource} from "discord-player";
import {Collection, CommandInteraction, PermissionResolvable, Snowflake} from "discord.js";
import playdl from "play-dl";
import EmbedUtil from "./EmbedUtil";

export default class MusicPlayer {

    public static playing = new Collection<Snowflake, boolean>();
    public static streamCount: number = 0;
    public static deletedQueueMessages: Snowflake[] = [];

    public static getOptions(): PlayerOptions {
        return {
            autoSelfDeaf: true,
            bufferingTimeout: 1000,
            initialVolume: 100,
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: false,
            leaveOnEmptyCooldown: 1000,
            spotifyBridge: true
        }
    }

    public static getRequiredPermissions(): PermissionResolvable[] {
        return [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "READ_MESSAGE_HISTORY",
            "ADD_REACTIONS",
            "EMBED_LINKS",
            "CONNECT",
            "SPEAK",
            "PRIORITY_SPEAKER"
        ];
    }

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
                            await playdl.search(`${track.author} ${track.title} lyrics`, {
                                limit: 2,
                                source: { youtube: "video" },
                        }).then(res => res[0].url))).stream;
                    }
                } catch (error: any) {
                    const embed = EmbedUtil.getErrorEmbed("An error ocurred while attempting to play that track.");
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

    public static getCurrentStreamCount(): number {
        return this.streamCount;
    }

    public static addStream(): void {
        this.streamCount++;
    }

    public static removeStream(): void {
        this.streamCount--;
    }
}