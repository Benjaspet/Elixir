export default class ElixirUtil {

    public static getTotalElixirMemberCount(client): number {
        return <number>ElixirUtil.formatLargeNumber(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + 25000);
    }

    public static getTotalElixirServerCount(client): number {
        return client.guilds.cache.size;
    }

    public static formatLargeNumber(num: number) {
        if (num < 1e3) return num;
        if (num >= 1e3) return +(num / 1e3).toFixed(2) + "K";
    }

    public static cleanDurationFormat(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (60 * 1000)) % 60).toString();
        const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
        return `${hrs}h ${min}m ${sec}s.`;
    }
}