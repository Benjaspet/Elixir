import * as Discord from "discord.js";
import {player, client} from "../../Elixir";
import DatabaseUtil from "../../utils/DatabaseUtil";

player.on("addList", (queue, playlist) => {
    DatabaseUtil.addPlaylistPlayed(1);
    const embed = new Discord.MessageEmbed()
       .setColor("PURPLE")
       .setDescription("[Playlist queued successfully.](" + playlist.url + ")")
       .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
       .setTimestamp()
    queue.textChannel.send({embeds: [embed]}).then(() => {});
});