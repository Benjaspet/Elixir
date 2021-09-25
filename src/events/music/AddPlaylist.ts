import {player, client} from "../../Elixir";
import * as Discord from "discord.js";
import DatabaseUtil from "../../utils/DatabaseUtil";

player.on("addList", (queue, playlist) => {
    DatabaseUtil.addPlaylistPlayed(1);
    const embed = new Discord.MessageEmbed()
       .setColor("PURPLE")
       .setDescription("**Queued playlist:** [" + playlist.name + "](" + playlist.url + ")")
       .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
       .setTimestamp()
    queue.textChannel.send({embeds: [embed]}).then(() => {});
});