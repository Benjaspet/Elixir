import {player, client} from "../../Elixir";

player.on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 110;
    queue.filters = ["lowbass"];
});