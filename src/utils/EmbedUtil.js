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

function fetchElixirInviteEmbed(client) {

    return new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription(`You can invite Elixir to your own server by [clicking here](${client.config.invite}).`)
        .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

}

function fetchElixirInfoEmbed(client) {

    return new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Elixir | Information")
        .setDescription(`Elixir is an advanced music bot for your server. Enjoy smooth audio replay with pristine quality and clearness. Playing high-quality music and creating an active, engaged community has never been easier!`)
        .addField("Bot Developer", "Eerie#6560 [Twitter: [@Eerie6560](https://twitter.com/Eerie6560)]")
        .addField("Libraries & Tools", "DJSv13@dev, MongoDB")
        .addField("Additional Information", "\n" +
            `Website: https://ponjo.club/elixir\n` +
            `Invite: [click here!](${client.config.invite})`)
        .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

}

module.exports = {
    fetchHelpCommandEmbed,
    fetchElixirMusicErrorEmbed,
    fetchElixirInviteEmbed,
    fetchElixirInfoEmbed
}