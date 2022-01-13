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

import {
    ApplicationCommandData,
    Client,
    CommandInteraction,
    GuildMember,
    MessageEmbed,
    StageChannel,
    VoiceChannel
} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import {Queue} from "discord-player";
import {player} from "../Elixir";
import CustomPlaylistUtil from "../utils/CustomPlaylistUtil";
import EmbedUtil from "../utils/EmbedUtil";
import MusicPlayer from "../utils/MusicPlayer";
import CustomPlaylist from "../schemas/PlaylistSchema";
import Utilities from "../utils/Utilities";
import Logger from "../structs/Logger";
import Command from "../structs/Command";

export default class PlaylistCommand extends Command {

    public name: string = "playlist";
    public description: string = "Manage custom playlists.";
    private readonly client: Client;

    constructor(client: Client) {
        super("playlist", {
            name: "playlist",
            description: "Manage custom playlists.",
            options: [
                {
                    name: "create",
                    description: "Create a custom playlist.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "id",
                            description: "The ID of your custom playlist.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: false
                        }
                    ],
                },
                {
                    name: "fetch",
                    description: "Fetch a custom playlist by ID.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "id",
                            description: "The ID of your custom playlist.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: false
                        }
                    ],
                },
                {
                    name: "queue",
                    description: "Add a custom playlist to the queue.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "id",
                            description: "The ID of your custom playlist.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: false
                        }
                    ],
                },
                {
                    name: "addtrack",
                    description: "Add a track to a custom playlist.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "id",
                            description: "The ID of your custom playlist.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: false
                        },
                        {
                            name: "track",
                            description: "The track to add to the playlist.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: false
                        }
                    ],
                },
                {
                    name: "removetrack",
                    description: "Remove a track from a custom playlist.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "id",
                            description: "The playlist ID.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: false
                        },
                        {
                            name: "track",
                            description: "The track number to remove.",
                            type: ApplicationCommandOptionTypes.NUMBER,
                            required: true,
                            autocomplete: false
                        }
                    ],
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        await interaction.deferReply();
        try {
            let id: string, track: string, embed: MessageEmbed;
            const action: string = interaction.options.getSubcommand();
            switch (action) {
                case "create":
                    id = interaction.options.getString("id");
                    await CustomPlaylistUtil.createCustomPlaylist(interaction.user.id, id)
                        .then(async result => {
                            if (!result.status) {
                                embed = EmbedUtil.getErrorEmbed("A playlist by that ID already exists.");
                                return await interaction.editReply({embeds: [embed]});
                            } else {
                                embed = EmbedUtil.getDefaultEmbed("Created a custom playlist with ID **" + id + "**.");
                                return await interaction.editReply({embeds: [embed]});
                            }
                        }).catch(() => {
                            embed = EmbedUtil.getErrorEmbed("An unknown error ocurred.");
                            return interaction.editReply({embeds: [embed]});
                        });
                    break;
                case "fetch":
                    id = interaction.options.getString("id");
                    await CustomPlaylistUtil.getCustomPlaylist(id)
                        .then(async result => {
                            const endPosition: number = result.tracks.length >= 10 ? 10 - 1 : result.tracks.length;
                            const list = result.tracks.slice(0, endPosition).map((track, i) => {
                                const title: string = result.tracks[i].title;
                                const reducedTitle: string = title.length > 60 ? title.substring(0, 60) + "..." : title;
                                return `**${i + 1}**. [${reducedTitle}](${result.tracks[i].url}) (${result.tracks[i].duration})`;
                            });
                            embed = new MessageEmbed()
                                .setTitle(id)
                                .setColor("PURPLE")
                                .addField("Tracks Preview", list.join("\n"))
                                .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL({dynamic: false})})
                                .setTimestamp();
                            return void await interaction.editReply({embeds: [embed]});
                        })
                        .catch(async () => {
                            embed = EmbedUtil.getErrorEmbed("Unable to find a playlist by that ID.");
                            return void await interaction.editReply({embeds: [embed]});
                        });
                    break;
                case "queue":
                    id = interaction.options.getString("id");
                    if (interaction.member instanceof GuildMember) {
                        const channel: VoiceChannel|StageChannel = interaction.member.voice.channel;
                        if (!channel) {
                            const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                            return void await interaction.editReply({embeds: [embed]});
                        }
                        let queue: Queue = await player.getQueue(interaction.guild);
                        if (!queue) {
                            queue = await player.createQueue(interaction.guild, MusicPlayer.getQueueInitOptions(interaction));
                        }
                        embed = EmbedUtil.getDefaultEmbed("Searching for your query...");
                        await interaction.editReply({embeds: [embed]});
                        await CustomPlaylistUtil.playCustomPlaylist(queue, id, interaction.member.voice.channel);
                        let initialConnection: boolean;
                        try {
                            if (!queue.connection) {
                                initialConnection = true;
                                await queue.connect(interaction.member.voice.channel);
                            }
                        } catch {
                            const embed = EmbedUtil.getErrorEmbed("Unable to join your voice channel.");
                            await player.deleteQueue(interaction.guild);
                            return await interaction.reply({embeds: [embed]});
                        }
                        if (initialConnection) await queue.play();
                        MusicPlayer.setPlaying(queue, true);
                        return;
                    }
                    break;
                case "addtrack":
                    id = interaction.options.getString("id");
                    track = interaction.options.getString("track");
                    const result = await CustomPlaylist.findOne({playlistId: id, userId: interaction.user.id});
                    if (!result) return void await interaction.editReply({
                        content: "You cannot modify that playlist as you are not the creator or it does not exist."
                    });
                    await CustomPlaylistUtil.addTrackToCustomPlaylist(interaction.user.id, track, id, result)
                        .then(async data => {
                            if (!data.status) return await interaction.editReply({
                                content: "You cannot add multiple tracks to custom playlists at once."
                            });
                            const endPosition: number = data.tracks.length >= 10 ? 10 - 1 : data.tracks.length;
                            const list = data.tracks.slice(0, endPosition).map((track, i) => {
                                return `**#${i + 1}** ─ ${track}`;
                            });
                            embed = new MessageEmbed()
                                .setTitle("Success!")
                                .setDescription(`**${id}** was updated successfully.`)
                                .setColor("PURPLE")
                                .addField("Playlist Data", "• Total tracks: " + data.tracks.length.toString())
                                .addField("Sample Tracks", list.join("\n"))
                                .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL({dynamic: false})})
                                .setTimestamp();
                            return await interaction.editReply({embeds: [embed]});
                        })
                        .catch(async () => {
                            return await interaction.editReply({
                                content: "An error occurred while running this."
                            });
                        });
                    break;
                case "removetrack":
                    id = interaction.options.getString("id");
                    const trackPosition: number = parseInt(interaction.options.getString("track"));
                    const response = await CustomPlaylist.findOne({playlistId: id, userId: interaction.user.id});
                    if (!response) return void await interaction.editReply({
                        content: "You cannot modify that playlist as you are not the creator or it does not exist."
                    });
                    await CustomPlaylistUtil.removeTrackFromCustomPlaylist(interaction.user.id, trackPosition, id)
                        .then(async result => {
                            if (result) {
                                return void await interaction.editReply({
                                    content: `Removed track **#${trackPosition}** from ${id}.`
                                });
                            }
                        })
                        .catch(async () => {
                            return void await interaction.editReply({
                                content: "You cannot modify that playlist as you are not the creator."
                            });
                        });
            }
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, interaction.guild.id);
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}