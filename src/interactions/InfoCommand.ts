import * as Discord from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (interaction.commandName === "info") {
            DatabaseUtil.addExecutedCommand(1);
            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "info")]});
        }
    }
}