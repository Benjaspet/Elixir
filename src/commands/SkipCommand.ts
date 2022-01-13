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
import {Queue} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";

export default class SkipCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("skip", {
            name: "skip",
            description: "Skip to the next song in the queue.",
            options: [
                {
                    name: "track",
                    description: "The track position to skip to.",
                    type: ApplicationCommandOptionTypes.NUMBER,
                    required: false,
                    autocomplete: false
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const queue: Queue = player.getQueue(interaction.guild);
                const member = interaction.member;
                const skipTo = interaction.options.getNumber("track");
                if (member instanceof GuildMember) {
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return await interaction.reply({embeds: [embed]});
                    } else if (skipTo) {
                        try {
                            queue.skipTo(skipTo - 1);
                            const embed = EmbedUtil.getDefaultEmbed("Skipped to track **#" + skipTo + "**.");
                            return await interaction.reply({embeds: [embed]});
                        } catch (error: any) {
                            const embed = EmbedUtil.getErrorEmbed("That track number is not in the queue.");
                            return await interaction.reply({embeds: [embed]});
                        }
                    } else {
                        queue.skip();
                        const embed = EmbedUtil.getDefaultEmbed("Skipped to the next track.");
                        return await interaction.reply({embeds: [embed]});
                    }
                } else {
                    return await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error) {
                Logger.error(error);
                Utilities.sendWebhookMessage(error, true, interaction.guild.id);
                const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
                return await interaction.reply({embeds: [embed]});
            }
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}