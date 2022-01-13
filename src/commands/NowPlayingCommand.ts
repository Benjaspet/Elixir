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

import {ApplicationCommandData, Client, CommandInteraction, GuildMember, MessageEmbed} from "discord.js";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";
import Vars from "../constants/Vars";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";
import {Queue, Track} from "discord-player";

export default class NowPlayingCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("nowplaying", {
            name: "nowplaying",
            description: "View information about the song currently playing."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member: any = interaction.member;
            if (member instanceof GuildMember) {
                if (!queue || !queue.playing) {
                    const embed: MessageEmbed = EmbedUtil.getErrorEmbed("There's no queue at the moment.");
                    return void await interaction.reply({embeds: [embed]});
                } else if (!member.voice.channel) {
                    const embed: MessageEmbed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return void await interaction.reply({embeds: [embed]});
                } else {
                    const divisor: number = queue.streamTime / queue.current.durationMS;
                    const percentage: string = divisor >= 100 ? "Done." : Math.round((divisor * 100)).toString() + "%";
                    const current: Track = queue.current;
                    const embed = new MessageEmbed()
                        .setTitle("Currently Playing")
                        .setColor(Vars.DEFAULT_EMBED_COLOR)
                        .setDescription(`[${current.title}](${current.url})`)
                        .addField("Track Details", "" + "• Duration: " + current.duration + "\n" +
                            "• Percent completed: " + percentage + "\n" + "• Artist: " + current.author + "\n" +
                            "• Requested by: " + `<@${current.requestedBy.id}>` + "\n" + "• Source: " + current.source)
                        .setThumbnail(current.thumbnail)
                        .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL()})
                        .setTimestamp()
                    return void await interaction.reply({embeds: [embed]})
                }
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
            return void await interaction.reply({embeds: [embed]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}