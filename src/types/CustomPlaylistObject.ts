import {Track} from "discord-player";

export interface CustomPlaylistObject {
    status: boolean,
    playlistId?: string,
    tracks?: Track[]
}