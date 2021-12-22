import songlyrics from "songlyrics";

export default class LyricUtil {

    public static async getLyrics(song: string): Promise<any> {
        return await new Promise(async (resolve, reject) => {
            await songlyrics(song)
                .then(async result => resolve({source: result.source, lyrics: result.lyrics}))
                .catch(error => reject(error))
        });
    }
}