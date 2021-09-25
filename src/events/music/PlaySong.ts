import {player, client} from "../../Elixir";
import DatabaseUtil from "../../utils/DatabaseUtil";

player.on("playSong", (queue, song) => {
    DatabaseUtil.addPlayedSong(1);
});