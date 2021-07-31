const Discord = require("discord.js");
const client = require("../Elixir");
const prefix = "b!"

client.on('messageCreate', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(' ')
    const command = args.shift().toLowerCase()

    if (command === 'ping') {
        message.channel.send({content: "Pong!"}).then(r => {})
    }

    if (command === 'play') {
        client.player.play(message, args.join(' '));
    }

});