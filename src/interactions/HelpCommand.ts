import * as Discord from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (interaction.commandName === "help") {

            if (!interaction.options.get("category")) {

                return await interaction.reply({content: "No category. Success!"});

            }

            const {value: string} = interaction.options.get("category");

            switch (string) {

                case "help-faq":

                    return await interaction.reply({content: "Success!"});

                case "help-invite":

                    return await interaction.reply({content: "Success!"});

                case "help-support":

                    return await interaction.reply({content: "Success!"});

                case "help-commands":

                    return await interaction.reply({content: "Success!"});

            }

            await interaction.reply({embeds: [client.embeds.fetchHelpCommandEmbed(client)]})

        }

    }
}