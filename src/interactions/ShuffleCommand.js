const Discord = require("discord.js");
const client = require("../Elixir");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "shuffle") {

        const queue = client.player.getQueue(interaction.guild.id);
        const channel = interaction.member?.voice.channel;

        if (!channel) {

            return interaction.reply({embeds: [await client.utils.sendError(`${client.config.emojis.error} You must be in a voice channel.`)]})

        }

        if (!queue) {

            return interaction.reply({embeds: [await client.utils.sendError(`${client.config.emojis.error} There are no songs in the queue.`)]})

        }

        await client.player.shuffle(queue);
        return interaction.reply({embeds: [await client.utils.sendSuccess(`${client.config.emojis.success} Shuffled the queue.`)]});

    }

});