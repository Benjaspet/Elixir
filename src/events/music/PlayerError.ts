import {player, client} from "../../Elixir";
import EmbedUtil from "../../utils/EmbedUtil";

player.on("error", (channel, error) => {
    console.log(error);
    channel.send({embeds: [EmbedUtil.fetchEmbedByType(client, "error", "An error occurred.")]}).then(() => {});
});