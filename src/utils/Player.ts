import {PlayerOptions} from "discord-player";
import {Permissions} from "discord.js";

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

    public static getRequiredVoicePermission(): bigint[] {
        return [
            Permissions.FLAGS.VIEW_CHANNEL,
            Permissions.FLAGS.CONNECT,
            Permissions.FLAGS.SPEAK
        ];
    }

    public static getRequiredTextPermissions(): bigint[] {
        return [
            Permissions.FLAGS.VIEW_CHANNEL,
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Permissions.FLAGS.ADD_REACTIONS,
            Permissions.FLAGS.EMBED_LINKS
        ];
    }
}