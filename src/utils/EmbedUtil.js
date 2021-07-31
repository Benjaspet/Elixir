const Discord = require("discord.js");
const client = require("../Elixir");

function fetchHelpCommandEmbed(client) {

    return new Discord.MessageEmbed()
        .setTitle("Elixir | Help")
        .setColor("PURPLE")
        .setDescription(`Below you can find all available commands. Please note that, due to an API update, traditional prefix commands are no longer supported, and Elixir has fully adapted to built-in slash commands for version 3.0. If you'd like to use this bot in your own server, [invite Elixir here](${client.config.invite})!`)
        .addField("Music [1]", "```" +
            "/autoplay\n" +
            "/shuffle\n" +
            "/skip\n" +
            "/filter\n" +
            "/forward\n" +
            "/loop\n" +
            "/lyrics\n" +
            "/nowplaying```\n", true)
        .addField("Music [2]", "```" +
            "/pause\n" +
            "/play\n" +
            "/queue\n" +
            "/resume\n" +
            "/rewind\n" +
            "/stop\n" +
            "/volume\n" +
            "/seek```\n", true)
        .addField("Information", "```" +
            "/help\n" +
            "/info\n" +
            "/ping\n" +
            "/support\n" +
            "/about\n" +
            "/changelog\n" +
            "/prefix\n" +
            "/invite```\n", true)
        .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

}

function fetchElixirMusicErrorEmbed(error) {

    return new Discord.MessageEmbed()
        .setTitle("An error occurred.")
        .setColor("RED")
        .setDescription("```js" + error + "```")
        .setTimestamp()


}

module.exports = {
    fetchHelpCommandEmbed,
    fetchElixirMusicErrorEmbed
}