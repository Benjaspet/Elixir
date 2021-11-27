import config from "../resources/Config";
import axios from "axios";

export default class SpotifyAPIUtil {

    public static async getRefreshedAccessToken(): Promise<string> {
        return await axios(config.spotifyApi.postUri, {
            method: "post",
            headers: {
                'Authorization': `Basic ${config.spotifyApi.base64Auth}`
            }
        }).then(async (response) => {
            if (response.status == 400) {
                return this.getRefreshedAccessToken();
            } else {
                return response.data.access_token;
            }
        });
    }

    public static async getSpotifyTrack(track: string) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await this.getRefreshedAccessToken(),
        }
        return await axios(`https://api.spotify.com/v1/search?q=${encodeURIComponent(track)}&type=track&limit=2`, {
            method: "get",
            headers: headers
        }).then(async(response) => {
                if (response.status == 400) {
                    return {
                        status: 400,
                        message: "Invalid query."
                    }
                } else {
                    let name, artist, artistUrl, songId, trackUrl;
                    if (response.data.tracks.total === 0) {
                        return {
                            total: 0,
                            name: undefined,
                            artist: undefined,
                            artistUrl: undefined,
                            songId: undefined,
                            trackUrl: undefined
                        };
                    }
                    name = response.data.tracks.items[0].name;
                    artist = response.data.tracks.items[0].artists[0].name;
                    artistUrl = response.data.tracks.items[0].artists[0].external_urls.spotify;
                    songId = response.data.tracks.items[0].id;
                    trackUrl = response.data.tracks.items[0].external_urls.spotify
                    return {
                        status: 200,
                        name: name,
                        artist: artist,
                        artistUrl: artistUrl,
                        songId: songId,
                        trackUrl: trackUrl
                    };
                }
            });
    }
}

