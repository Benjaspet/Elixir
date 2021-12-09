import {Model, model, Schema} from "mongoose";

const StatsSchema: Schema = new Schema(
    {
        commandsRan: Number,
        songsPlayed: Number,
        playlistsQueued: Number,
    }, {
        timestamps: true,
        versionKey: false
    }
);

const Stats: Model<any> = model("stats", StatsSchema);
export default Stats;