import * as Discord from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (interaction.commandName === "help") {
            DatabaseUtil.addExecutedCommand(1);
            if (!interaction.options.get("category")) {
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "help-default")]});
            }
            const {value: string} = interaction.options.get("category");
            switch (string) {
                case "help-faq":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "help-faq")]});
                case "help-invite":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "help-invite")]});
                case "help-support":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "help-support")]});
                case "help-commands":
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(client, "help-default")]});
            }
        }
    }
}