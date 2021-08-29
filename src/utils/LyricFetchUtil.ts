import axios from "axios";
import config from "../resources/Config";
import LyricScrapeUtil from "./LyricScrapeUtil";

const search_url = 'https://api.genius.com/search?q=';
const access_token = config.developer.geniusKey;

export default class LyricFetchUtil {

    public static async searchForSong(query: string) {
        try {
            const req_url = `${search_url}${encodeURIComponent(query)}`
            const headers = {
                Authorization: 'Bearer ' + access_token
            };
            let {data} = await axios.get(req_url, { headers });
            if (data.response.hits.length === 0) return null;
            const {full_title, song_art_image_url, id, url} = data.response.hits[0].result;
            return {full_title, song_art_image_url, id, url};
        } catch (error) {
            throw error;
        }
    }

    public static async getLyrics(url: string) {
        return await LyricScrapeUtil.scrapeLyrics(url);
    }
}