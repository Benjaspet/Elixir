import {Client} from "discord.js";
import config from "../resources/Config";
import {SpotifyPlugin} from "@distube/spotify";

export default class ElixirUtil {

    public static getTotalElixirMemberCount(client): number {
        return <number>ElixirUtil.formatLargeNumber(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + 25000);
    }

    public static getTotalElixirServerCount(client): number {
        return client.guilds.cache.size;
    }

    public static formatLargeNumber(num: number): number | string {
        if (num < 1e3) return num;
        if (num >= 1e3) return +(num / 1e3).toFixed(2) + "K";
    }

    public static cleanDurationFormat(ms): string {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (60 * 1000)) % 60).toString();
        const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
        return `${hrs}h ${min}m ${sec}s.`;
    }

    public static formatSeconds(seconds: number){
        function pad(sec: number){
            return (sec < 10 ? '0' : '') + sec;
        }
        const hours = Math.floor(seconds / (60 * 60));
        const minutes = Math.floor(seconds % (60 * 60) / 60);
        const secs = Math.floor(seconds % 60);
        return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
    }

    public static sleep(ms): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static getWebsocketLatency(client: Client): number {
        return client.ws.ping;
    }

    public static getProcessUptime(): string {
        const uptimeAsUnix = process.uptime();
        return ElixirUtil.formatSeconds(uptimeAsUnix);
    }

    public static cleanFormat(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public static capitalize(phrase: string) {
        return phrase
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    public static getVersion(): string {
        return config.version;
    }

    public static getMusicOptions(): object {
        return {
            emitNewSongOnly: false,
            leaveOnEmpty: true,
            leaveOnFinish: true,
            leaveOnStop: true,
            savePreviousSongs: true,
            emitAddListWhenCreatingQueue: true,
            emitAddSongWhenCreatingQueue: true,
            customFilters: {
                "clear": "dynaudnorm=f=200",
                "lowbass": "bass=g=6,dynaudnorm=f=200",
                "bassboost": "bass=g=20,dynaudnorm=f=200",
                "purebass": "bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08",
                "8D": "apulsator=hz=0.08",
                "vaporwave": "aresample=48000,asetrate=48000*0.8",
                "nightcore": "aresample=48000,asetrate=48000*1.25",
                "phaser": "aphaser=in_gain=0.4",
                "tremolo": "tremolo",
                "vibrato": "vibrato=f=6.5",
                "reverse": "areverse",
                "treble": "treble=g=5",
                "normalizer": "dynaudnorm=f=200",
                "surrounding": "surround",
                "pulsator": "apulsator=hz=1",
                "subboost": "asubboost",
                "karaoke": "stereotools=mlev=0.03",
                "flanger": "flanger",
                "gate": "agate",
                "haas": "haas",
                "mcompand": "mcompand"
            },
            plugins: [new SpotifyPlugin()]
        }
    }
}