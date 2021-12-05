import {model, Schema} from "mongoose";

const StatsSchema = new Schema(
    {
        commandsRan: Number,
        songsPlayed: Number,
        playlistsQueued: Number,
    }, {
        timestamps: true,
        versionKey: false
    }
);

const Stats = model("stats", StatsSchema);
export default Stats;