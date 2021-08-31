import player from "../managers/MusicManager";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "stop") {
            DatabaseUtil.addExecutedCommand(1);
            try {
                const queue = player.getQueue(interaction.guild.id);
                const channel = interaction.member?.voice.channel;
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There is no queue for the server.")]});
                }
                if (!channel) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel.")]});
                }
                await queue.stop();
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Stopped the queue & left the voice channel.")]});
            } catch (error) {
                console.log(error);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred while running this command.")]});
            }
        }
    }
}