import player from "../../managers/MusicManager";

player.on("initQueue", queue => {

    queue.autoplay = false;
    queue.volume = 100;
    queue.filters = ["lowbass"];

});