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
import {QueryType, Queue, Track, TrackSource} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import Logger from "../structs/Logger";
import playdl from "play-dl";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";

export default class SearchCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("search", {
            name: "search",
            description: "Search for a specific song.",
            options: [
                {
                    name: "song",
                    description: "The URL or song query.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true,
                    autocomplete: true
                }
            ],
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const member = interaction.member;
            const track = interaction.options.getString("song");
            if (member instanceof GuildMember) {
                if (!member.voice.channel) {
                    const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                    return await interaction.reply({embeds: [embed]});
                } else {
                    const searchResult = await player.search(track, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.AUTO
                    });
                    if (!searchResult || !searchResult.tracks.length) {
                        const embed = EmbedUtil.getErrorEmbed("No results found.");
                        return await interaction.reply({embeds: [embed]});
                    }
                    const embed = EmbedUtil.getDefaultEmbed("Searching for the track...");
                    await interaction.reply({embeds: [embed]});
                    const queue = await player.createQueue(interaction.guild, {
                        metadata: {
                            channel: interaction.channel
                        },
                        bufferingTimeout: 500,
                        disableVolume: false,
                        leaveOnEnd: true,
                        leaveOnStop: true,
                        leaveOnEmpty: false,
                        leaveOnEmptyCooldown: 30000,
                        async onBeforeCreateStream(track: Track, source: TrackSource, _queue: Queue) {
                            let vid;
                            try {
                                if (track.url.includes("youtube.com")) {
                                    vid = (await playdl.stream(track.url)).stream;
                                } else {
                                    vid = (await playdl.stream(
                                        await playdl.search(`${track.author} ${track.title} lyric`, {
                                            limit: 1,
                                            source: {
                                                youtube: "video"
                                            }
                                        }).then(x => x[0].url))).stream;
                                }
                            } catch {
                                const embed = EmbedUtil.getErrorEmbed("An error ocurred while attempting to play that track.");
                                vid = (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", {quality: 0})).stream;
                                return await interaction.reply({embeds: [embed]});
                            }
                            return vid;
                        }
                    });
                    let justConnected;
                    try {
                        if (!queue.connection) {
                            justConnected = true;
                            await queue.connect(member.voice.channel);
                        }
                    } catch {
                        const embed = EmbedUtil.getErrorEmbed("Unable to join your voice channel.");
                        await player.deleteQueue(interaction.guild);
                        return await interaction.reply({embeds: [embed]});
                    }
                    if (searchResult.playlist) searchResult.tracks[0].playlist = searchResult.playlist;
                    await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
                    if (justConnected) queue.play();
                }
            }
        } catch (error) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
            await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("An error ocurred.")]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}