import player from "../../managers/MusicManager";

player.on("initQueue", queue => {

    queue.autoplay = false;
    queue.volume = 125;
    queue.filters = ["lowbass"];

});