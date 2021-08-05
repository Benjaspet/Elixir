const Discord = require("discord.js");
const client = require("../Elixir");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "help") {

        if (!interaction.options.get("category")) {

            return await interaction.reply({content: "No category. Success!"});

        }

        const {value: string} = interaction.options.get("category");

        switch (string) {

            case "help-faq":

                await interaction.reply({content: "Success!"});
                break;

            case "help-invite":

                await interaction.reply({content: "Success!"});
                break;

            case "help-support":

                await interaction.reply({content: "Success!"});
                break;

            case "help-commands":

                await interaction.reply({content: "Success!"});
                break;

        }

        await interaction.reply({embeds: [client.embeds.fetchHelpCommandEmbed(client)]})

    }

});