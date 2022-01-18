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

import {ApplicationCommandData, Client, CommandInteraction, GuildMember} from "discord.js";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";

export default class ShuffleCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("shuffle", {
            name: "shuffle",
            description: "Shuffle the order of the tracks in the queue."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const queue = player.getQueue(interaction.guild.id);
            const member = interaction.member;
            if (member instanceof GuildMember) {
                if (!queue || !queue.playing) {
                    const embed = EmbedUtil.getErrorEmbed("There are no songs in the queue.");
                    return await interaction.reply({embeds: [embed]});
                } else if (!member.voice.channel) {
                    const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return await interaction.reply({embeds: [embed]});
                } else if (queue.tracks.length <= 1) {
                    const embed = EmbedUtil.getErrorEmbed("The queue isn't large enough to be shuffled.");
                    return await interaction.reply({embeds: [embed]});
                } else {
                    queue.shuffle();
                    const embed = EmbedUtil.getDefaultEmbed("Shuffled the queue successfully.");
                    return await interaction.reply({embeds: [embed]});
                }
            } else {
                return await interaction.reply({content: "This command must be run in a guild."});
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
            return await interaction.reply({embeds: [embed]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}