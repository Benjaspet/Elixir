import {joinVoiceChannel, entersState, VoiceConnectionStatus} from "@discordjs/voice";
import {StageChannel, VoiceChannel} from "discord.js";

export default class VoiceManager {

    public static async connectToVoiceChannel(channel: VoiceChannel|StageChannel) {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        } catch (error) {
            connection.destroy();
            throw error;
        }
    }
}