import player from "../../managers/MusicManager";
import * as Discord from "discord.js";
import client from "../../Elixir";

player.on("addList", (queue, playlist) => {
    const embed = new Discord.MessageEmbed()
       .setColor("PURPLE")
       .setDescription("**Queued playlist:** [" + playlist.name + "](" + playlist.url + ")")
       .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
       .setTimestamp()
    queue.textChannel.send({embeds: [embed]}).then(() => {});
});