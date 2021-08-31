import player from "../managers/MusicManager";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "shuffle") {
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
                if (interaction.guild.me.voice.channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in the same voice channel as me.")]});
                }
                if (queue.songs.length <= 1) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You cannot shuffle the queue. There is one song.")]});
                }
                await player.shuffle(interaction.guild.id);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Successfully shuffled the queue.")]});
            } catch (error) {
                console.log(error);
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred while running this command.")]});
            }
        }
    }
}