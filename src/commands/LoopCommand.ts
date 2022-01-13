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
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";
import {Queue, QueueRepeatMode} from "discord-player";

export default class LoopCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("loop", {
            name: "loop",
            description: "Loop a song or queue.",
            options: [
                {
                    name: "mode",
                    description: "The type of loop to apply.",
                    type: ApplicationCommandOptionTypes.INTEGER,
                    required: true,
                    choices: [
                        {
                            name: "Track Loop",
                            value: QueueRepeatMode.TRACK
                        },
                        {
                            name: "Queue Loop",
                            value: QueueRepeatMode.QUEUE
                        },
                        {
                            name: "Autoplay",
                            value: QueueRepeatMode.AUTOPLAY
                        },
                        {
                            name: "Disable Loop",
                            value: QueueRepeatMode.OFF
                        }
                    ]
                }
            ]
        })
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member = interaction.member;
            const mode = interaction.options.getInteger("mode");
            if (member instanceof GuildMember) {
                if (!queue) {
                    const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                    return void await interaction.reply({embeds: [embed]});
                } else if (!member.voice.channel) {
                    const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return void await interaction.reply({embeds: [embed]});
                } else {
                    switch (mode) {
                        case QueueRepeatMode.TRACK:
                            queue.setRepeatMode(QueueRepeatMode.TRACK);
                            return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **track**.")]});
                        case QueueRepeatMode.QUEUE:
                            queue.setRepeatMode(QueueRepeatMode.QUEUE);
                            return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **queue**.")]});
                        case QueueRepeatMode.AUTOPLAY:
                            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                            return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **autoplay**.")]});
                        case QueueRepeatMode.OFF:
                            queue.setRepeatMode(QueueRepeatMode.OFF);
                            return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Turned **off** repeat mode.")]});
                    }
                }
            } else {
                return void await interaction.reply({content: "This command must be run in a guild."});
            }
        } catch (error) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
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