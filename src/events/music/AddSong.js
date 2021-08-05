const Discord = require("discord.js");
const client = require("../../Elixir");

client.player.on("addSong", (queue, song) => {

    const embed = new Discord.MessageEmbed()
        .setThumbnail(song.thumbnail)
        .setDescription(`` +
            `**Queued:** [${song.name}](${song.url})` + "\n" +
            `**Duration:** ${song.formattedDuration}` + "\n" + "")
        .setColor("PURPLE")
        .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${client.utils.cleanDurationFormat(queue.duration * 1000)}`)
        .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()

    queue.textChannel.send({embeds: [embed]})
        .then(promise => {});

});