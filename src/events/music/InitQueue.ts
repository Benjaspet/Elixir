import {player} from "../../Elixir";

player.on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 110;
});