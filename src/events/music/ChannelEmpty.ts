import {player, client} from "../../Elixir";
import * as Discord from "discord.js";

player.on("empty", queue => {
    const embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription("There was nobody remaining in the voice channel, so I left.")
    queue.textChannel.send({embeds: [embed]}).then(() => {});
});