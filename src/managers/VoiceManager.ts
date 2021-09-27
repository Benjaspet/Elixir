const {joinVoiceChannel,
    entersState,
    VoiceConnectionStatus} = require("@discordjs/voice");

export default class VoiceManager {

    public static sendFollowUp = [];

    public static async connectToVoiceChannel(channel) {
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