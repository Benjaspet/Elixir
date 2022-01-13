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
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";
import MusicPlayer from "../utils/MusicPlayer";
import Command from "../structs/Command";

export default class StopCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("stop", {
            name: "stop",
            description: "Stop the queue & remove Elixir from the voice channel."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const queue: Queue = player.getQueue(interaction.guild);
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return void await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return void await interaction.reply({embeds: [embed]});
                    } else {
                        MusicPlayer.setPlaying(queue, false);
                        queue.connection.voiceConnection.disconnect();
                        queue.stop();
                        const embed = EmbedUtil.getDefaultEmbed("Cleared the queue and left the voice channel.");
                        return void await interaction.reply({embeds: [embed]});
                    }
                } else {
                    return void await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                const embed = EmbedUtil.getErrorEmbed("An error occurred while running this command.");
                return void await interaction.reply({embeds: [embed]});
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