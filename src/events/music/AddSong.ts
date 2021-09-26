import {player} from "../../Elixir";
import DatabaseUtil from "../../utils/DatabaseUtil";

player.on("addSong", async (queue, song) => {
    DatabaseUtil.addPlayedSong(1);
});