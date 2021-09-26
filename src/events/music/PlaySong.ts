import {player, client} from "../../Elixir";
import DatabaseUtil from "../../utils/DatabaseUtil";
import SpotifyAPIUtil from "../../utils/SpotifyAPIUtil";
import * as Discord from "discord.js";
import ElixirUtil from "../../utils/ElixirUtil";
import EmbedUtil from "../../utils/EmbedUtil";

player.on("playSong", async (queue, song) => {
    // DatabaseUtil.addPlayedSong(1);
    // try {
    //     const data = await SpotifyAPIUtil.getSpotifyTrack(song.name);
    //     const songName = data.name ? data.name : song.name;
    //     const artist = data.artist ? data.artist : song.uploader.name;
    //     const artistUrl = data.artistUrl ? data.artistUrl : "https://www.spotify.com/us"
    //     const url = data.trackUrl ? data.trackUrl : "https://www.spotify.com/us";
    //     const queueLength = queue.songs.length == 1 ? `${queue.songs.length} song.` : `${queue.songs.length} songs.`;
    //     const embed = new Discord.MessageEmbed()
    //         .setDescription(`` +
    //             `**Playing:** [${songName}](${url})`)
    //         .setColor("PURPLE")
    //         .addField(`Total Queue`, `‣ Song count: ${queueLength}\n‣ Duration: ${ElixirUtil.cleanDurationFormat(queue.duration * 1000)}`)
    //         .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
    //         .setTimestamp()
    //     queue.textChannel.send({embeds: [embed]}).then(() => {
    //     });
    // } catch (error) {
    //     console.log(error)
    //     queue.textChannel.send({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error ocurred.")]}).then(() => {
    //     });
    // }
});