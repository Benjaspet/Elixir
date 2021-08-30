import EmbedUtil from "../utils/EmbedUtil";
import player from "../managers/MusicManager";
import ElixirUtil from "../utils/ElixirUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "filter") {
            try {
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                const filter = interaction.options.getString("type");
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There is no queue for the server.")]});
                }
                await interaction.deferReply();
                await ElixirUtil.sleep(2000);
                if (filter === "remove-all") {
                    player.setFilter(interaction.guild.id, false, true);
                    return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Successfully removed all filters.")]});
                }
                player.setFilter(interaction.guild.id, filter);
                return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Successfully set the filter to **" + filter + "**.")]});
            } catch (error) {
                console.log(error)
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred while running this command.")]});
            }
        }
    }
}