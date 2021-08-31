import player from "../../managers/MusicManager";
import DatabaseUtil from "../../utils/DatabaseUtil";

player.on("playSong", (queue, song) => {
    DatabaseUtil.addPlayedSong(1);
});