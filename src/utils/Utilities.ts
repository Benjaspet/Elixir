/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

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

    /**
     * Format seconds to a standard timestamp format.
     * @param seconds The amount of seconds to process.
     * @return string
     */

    public static formatSeconds(seconds: number): string {
        function pad(sec: number){
            return (sec < 10 ? "0" : "") + sec;
        }
        const hours = Math.floor(seconds / (60 * 60));
        const minutes = Math.floor(seconds % (60 * 60) / 60);
        const secs = Math.floor(seconds % 60);
        return pad(hours) + ":" + pad(minutes) + ":" + pad(secs);
    }

    public static sleep(ms): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get the bot's websocket latency.
     * @param client The client instance
     * @return number
     */

    public static getWebsocketLatency(client: Client): number {
        return client.ws.ping;
    }

    /**
     * Get the bot's uptime.
     * @return string
     */

    public static getProcessUptime(): string {
        const uptimeAsUnix = process.uptime();
        return Utilities.formatSeconds(uptimeAsUnix);
    }

    public static cleanFormat(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Get the bot's intents.
     * @return any[]
     */

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

    public static sendWebhookMessage(debugMessage: any, guildPrefix: boolean, guild?: string): void {
        if (guildPrefix) {
            const webhook: WebhookClient = new WebhookClient({url: Config.get("DEBUG-WEBHOOK")});
            const embed: MessageEmbed = new MessageEmbed()
                .setTitle("Elixir | Debug")
                .setColor("PURPLE")
                .setDescription("```" + "\n" + debugMessage + "\n" + "```")
                .addField("Guild ID", "```" + "\n" + guild + "\n" + "```")
                .setFooter({text: "Elixir Music"})
                .setTimestamp()
            webhook.send({embeds: [embed]}).then(() => {});
        } else {
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
}