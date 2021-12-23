import {PlayerOptions, Queue} from "discord-player";
import {Collection, PermissionResolvable, Snowflake} from "discord.js";

export default class MusicPlayer {

    public static playing = new Collection<Snowflake, boolean>();
    public static streamCount: number = 0;

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