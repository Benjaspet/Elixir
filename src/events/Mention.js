const Discord = require("discord.js");
const client = require("../Elixir");

client.on("messageCreate", async message => {

    if (message.mentions.members.first()) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Elixir")
            .setColor("PURPLE")
            .setDescription(`Hello, ${message.author}!\nDue to a recent change in Discord's API, Elixir is being transferred to a solely slash-command handler. This means that traditional prefix commands will not work. You can access all of Elixir's commands by running \`/{command}\` via Discord's built-in slash command menu. You can use \`/help\` to view all available commands.\nWant to invite Elixir to your server? [click here!](${client.config.invite})`)
            .setFooter("ponjo.club", client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()

        if (message.mentions.users.first().id === client.config.client) {
            return message.channel.send({
                embeds: [embed],
                allowedMentions: {
                    repliedUser: false,
                }
            });

        }
    }
});