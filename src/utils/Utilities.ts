import {Client, Intents, MessageEmbed, Webhook, WebhookClient} from "discord.js";
import Config from "../Config";

export default class Utilities {

    public static getTotalElixirMemberCount(client): number {
        return <number>Utilities.formatLargeNumber(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) + 25000);
    }

    public static getTotalElixirServerCount(client): number {
        return client.guilds.cache.size;
    }

    public static formatLargeNumber(num: number): number | string {
        if (num < 1e3) return num;
        if (num >= 1e3) return +(num / 1e3).toFixed(2) + "K";
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
        return Utilities.formatSeconds(uptimeAsUnix);
    }

    public static cleanFormat(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public static getIntents(): any[] {
        return [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ];
    }

    public static sendWebhookMessage(debugMessage: any): void {
        const webhook: WebhookClient = new WebhookClient({url: Config.get("DEBUG-WEBHOOK")});
        const embed: MessageEmbed = new MessageEmbed()
            .setTitle("Elixir | Debug")
            .setColor("PURPLE")
            .setDescription("```" + "\n" + debugMessage + "\n" + "```")
            .setFooter({text: "Elixir Music"})
            .setTimestamp()
        webhook.send({embeds: [embed]}).then(() => {});
    }
}