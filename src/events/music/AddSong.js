const Discord = require("discord.js");
const client = require("../../Elixir");

client.player.on("addSong", (queue, song) => {

    queue.textChannel.send({content: `Added ${song.name} - \`${song.formattedDuration}\` to the queue.`})
        .then(promise => {});

});