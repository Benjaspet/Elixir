const Discord = require("discord.js");
const client = require("../Elixir");
const {deployAllSlashCommands} = require("../slash/SlashBase");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "invite") {

        await interaction.reply({embeds: [client.embeds.fetchElixirInviteEmbed(client)]})

    }

});