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

import {Client, Intents, MessageEmbed, WebhookClient} from "discord.js";
import Config from "../structs/Config";

export default class Utilities {

    /**
     * Get the total member count.
     * @param client The client that instantiated this.
     * @return number
     */

    public static getTotalElixirMemberCount(client): number {
        const amount: number = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
        return Utilities.formatLargeNumber(amount) as number;
    }

    /**
     * Format large numbers.
     * @param num The number to format.
     * @return number|string
     */

    public static formatLargeNumber(num: number): number|string {
        if (num < 1e3) return num;
        if (num >= 1e3) return +(num / 1e3).toFixed(2) + "K";
    }

    /**
     * Format seconds to a standard timestamp format.
     * @param seconds The amount of seconds to process.
     * @return string
     */

    public static formatSeconds(seconds: number): string {
        const pad = (sec: number) => { return (sec < 10 ? "0" : "") + sec; }
        const hours = Math.floor(seconds / (60 * 60));
        const minutes = Math.floor(seconds % (60 * 60) / 60);
        const secs = Math.floor(seconds % 60);
        return pad(hours) + ":" + pad(minutes) + ":" + pad(secs);
    }

    /**
     * The sleep utility function.
     * @param ms The amount of time to sleep.
     * @return Promise<any>
     */

    public static sleep(ms): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    /**
     * Send a webhook debug message.
     * @param debugMessage The error message to send.
     * @param guildPrefix Whether to alert the guild ID.
     * @param guild? The resolvable guild.
     */

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