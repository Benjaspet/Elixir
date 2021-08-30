import player from "../managers/MusicManager";
import EmbedUtil from "../utils/EmbedUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "skip") {
            try {
                const queue = player.getQueue(interaction.guild.id);
                const channel = interaction.member?.voice.channel;
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There is no queue for the server.")]});
                }
                if (!channel) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel.")]});
                }
                if (queue.songs.length <= 1) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There are no more songs in the queue.")]});
                }
                await player.skip(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Skipping to the next song...")]});
            } catch (error) {
                console.log(error);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred while running this command.")]});
            }
        }
    }
}