import EmbedUtil from "../utils/EmbedUtil";
import player from "../managers/MusicManager";
import ElixirUtil from "../utils/ElixirUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "volume") {
            DatabaseUtil.addExecutedCommand(1);
            try {
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                const volume = interaction.options.getNumber("amplifier");
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "There is no queue for the server.")]});
                }
                await interaction.deferReply();
                await ElixirUtil.sleep(1000);
                await player.setVolume(interaction.guild.id, volume);
                return await interaction.editReply({embeds: [EmbedUtil.fetchEmbedByType(client, "default", "Successfully set the volume to **" + volume + "**.")]});
            } catch (error) {
                console.log(error)
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred while running this command.")]});
            }
        }
    }
}