import * as Discord from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (interaction.commandName === "info") {
            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "info")]});
        }
    }
}