import axios from "axios";
import cheerio from "cheerio";

export default class LyricScrapeUtil {

    public static async scrapeLyrics(url: string) {
        try {
            let {data} = await axios.get(url);
            const $ = await cheerio.load(data);
            let lyric = $('div[class="lyrics"]').text().trim();
            if (!lyric) {
                lyric = '';
                $('div[class^="Lyrics__Container"]').each((i, elem) => {
                    if ($(elem).text().length !== 0) {
                        let snippet = $(elem).html()
                            .replace(/<br>/g, '\n')
                            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                        lyric += $('<textarea/>').html(snippet).text().trim() + '\n\n';
                    }
                });
            }
            if (!lyric) return null;
            return lyric.trim();
        } catch (error) {
            throw error;
        }
    }
}