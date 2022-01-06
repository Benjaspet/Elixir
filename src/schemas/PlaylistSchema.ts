import {model, Model, Schema} from "mongoose";

const PlaylistSchema: Schema = new Schema(
    {
        userId: String,
        playlistId: String,
        tracks: Array,
    },
    {
        timestamps: false,
        versionKey: false
    }
);

const CustomPlaylist: Model<any> = model("playlists", PlaylistSchema);
export default CustomPlaylist;