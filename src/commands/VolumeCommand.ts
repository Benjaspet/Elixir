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

export default class VolumeCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("volume", {
            name: "volume",
            description: "Amplify or lower the music volume.",
            options: [
                {
                    name: "amplifier",
                    description: "The volume amplifier.",
                    type: ApplicationCommandOptionTypes.NUMBER,
                    required: true,
                    choices: [
                        {
                            name: "100",
                            value: 100
                        },
                        {
                            name: "80",
                            value: 80
                        },
                        {
                            name: "60",
                            value: 60
                        },
                        {
                            name: "50",
                            value: 50
                        },
                        {
                            name: "40",
                            value: 40
                        },
                        {
                            name: "20",
                            value: 20
                        }
                    ]
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            await interaction.deferReply();
            try {
                const queue: Queue = player.getQueue(interaction.guild);
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    const volume = interaction.options.getNumber("amplifier");
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return await interaction.editReply({embeds: [embed]});
                    } else if (queue.volume == volume) {
                        const embed = EmbedUtil.getErrorEmbed("Please select a volume different from the current.");
                        return await interaction.editReply({embeds: [embed]});
                    } else {
                        queue.setVolume(volume);
                        const embed = EmbedUtil.getDefaultEmbed("Successfully set the volume to **" + volume + "**.");
                        return await interaction.editReply({embeds: [embed]});
                    }
                } else {
                    return await interaction.editReply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                Utilities.sendWebhookMessage(error, true, interaction.guild.id);
                const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
                return await interaction.editReply({embeds: [embed]});
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