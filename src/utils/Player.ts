import {PlayerOptions} from "discord-player";
import {PermissionResolvable, Permissions} from "discord.js";

export default class MusicPlayer {

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
}