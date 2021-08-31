import EmbedUtil from "../utils/EmbedUtil";
import player from "../managers/MusicManager";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "resume") {
            DatabaseUtil.addExecutedCommand(1);
            try {
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There is no queue for the server.")]});
                }
                await player.resume(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Successfully resumed the current song.")]});
            } catch (error) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "The song is already playing.")]});
            }
        }
    }
}