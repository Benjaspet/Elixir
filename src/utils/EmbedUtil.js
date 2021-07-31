const Discord = require("discord.js");
const client = require("../Elixir");

function fetchHelpCommandEmbed(client) {

    return new Discord.MessageEmbed()
        .setTitle("Elixir | Help")
        .setColor("PURPLE")
        .setDescription(`Below you can find all available commands. If you'd like to use this bot in your own server, [invite Elixir here](${client.config.invite}!)`)
        .addField("Music [1]", "```" +
            "e!autoplay\n" +
            "e!shuffle\n" +
            "e!skip\n" +
            "e!filter\n" +
            "e!forward\n" +
            "e!loop\n" +
            "e!lyrics\n" +
            "e!nowplaying```\n", true)
        .addField("Music [2]", "```" +
            "e!pause\n" +
            "e!play\n" +
            "e!queue\n" +
            "e!resume\n" +
            "e!rewind\n" +
            "e!stop\n" +
            "e!volume\n" +
            "e!seek```\n", true)
        .addField("Information", "```" +
            "e!help\n" +
            "e!info\n" +
            "e!ping\n" +
            "e!support\n" +
            "e!about\n" +
            "e!changelog\n" +
            "e!prefix\n" +
            "e!invite```\n", true)
        .setFooter(`https://ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

}

module.exports = {
    fetchHelpCommandEmbed
}