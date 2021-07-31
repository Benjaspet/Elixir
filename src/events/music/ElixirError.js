const Discord = require("discord.js");
const client = require("../../Elixir");

client.player.on("error", (channel, error) => {

    channel.send({embeds: [client.embeds.fetchElixirMusicErrorEmbed(error)]});

});

