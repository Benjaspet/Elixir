import {player, client} from "../../Elixir";
import * as Discord from "discord.js";
import ElixirUtil from "../../utils/ElixirUtil";
import SpotifyWebApi = require("spotify-web-api-node");
import config from "../../resources/Config";
import EmbedUtil from "../../utils/EmbedUtil";

player.on("addSong", (queue, song) => {

    const Spotify = new SpotifyWebApi({
        clientId: config.spotifyApi.cliendId,
        clientSecret: config.spotifyApi.clientSecret
    });

    Spotify.searchTracks("es mejor asi primera fila")
        .then(function(data) {
            console.log(data.body)
            const embed = new Discord.MessageEmbed()
                .setDescription(`` +
                    `**Queued:** [${song.name}](${song.url})` + "\n" +
                    `**Duration:** ${song.formattedDuration || "Unavailable."}`)
                .setColor("PURPLE")
                .addField(`Total Queue`, `‣ Song count: ${queue.songs.length} songs.\n‣ Duration: ${ElixirUtil.cleanDurationFormat(queue.duration * 1000)}`)
                .setFooter(`ponjo.club/elixir`, client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            queue.textChannel.send({embeds: [embed]})
                .then(() => {});
        }, function(error) {
            return queue.textChannel.send({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error ocurred.")]});
        });

});