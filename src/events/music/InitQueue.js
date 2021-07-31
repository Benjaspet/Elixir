const Discord = require("discord.js");
const client = require("../../Elixir");

client.player.on("initQueue", queue => {

    queue.autoplay = false;
    queue.volume = 125;
    queue.filter = "lowbass";

});