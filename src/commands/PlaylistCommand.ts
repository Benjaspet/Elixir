import {ICommand} from "../interfaces/ICommand";
import {Client, CommandInteraction, GuildMember, MessageEmbed} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import CustomPlaylistUtil from "../utils/CustomPlaylistUtil";
import EmbedUtil from "../utils/EmbedUtil";
import {Queue} from "discord-player";
import {player} from "../Elixir";
import MusicPlayer from "../utils/MusicPlayer";
import CustomPlaylist from "../schemas/PlaylistSchema";
import {ElixirStatus} from "../types/ElixirStatus";
import {CustomPlaylistObject} from "../types/CustomPlaylistObject";

export default class PlaylistCommand implements ICommand {

    public name: string = "playlist";
    public description: string = "Manage custom playlists.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            await interaction.deferReply();
            try {
                let id: string, track: string, embed: MessageEmbed;
                const action: string = interaction.options.getSubcommand();
                switch (action) {
                    case "create":
                        id = interaction.options.getString("id");
                        const res = await CustomPlaylistUtil.createCustomPlaylist(interaction.user.id, id);
                        if (!res.status) {
                            embed = EmbedUtil.getErrorEmbed("A playlist by that ID already exists.");
                            return await interaction.editReply({embeds: [embed]});
                        } else {
                            embed = EmbedUtil.getDefaultEmbed("Created a custom playlist with ID **" + id + "**.");
                            return await interaction.editReply({embeds: [embed]});
                        }
                    case "fetch":
                        id = interaction.options.getString("id");
                        await CustomPlaylistUtil.getCustomPlaylist(id)
                            .then(async result => {
                                const endPosition: number = result.length >= 10 ? 10 - 1 : result.length;
                                const list = result.slice(0, endPosition).map((track, i) => {
                                    return `**#${i + 1}** ─ ${result[i]}`;
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
                                embed = EmbedUtil.getErrorEmbed("A playlist by that ID was not found.");
                                return void await interaction.editReply({embeds: [embed]});
                            });
                        break;
                    case "queue":
                        id = interaction.options.getString("id");
                        let queue: Queue = player.getQueue(interaction.guild);
                        if (!queue) {
                            queue = player.createQueue(interaction.guild, MusicPlayer.getQueueInitOptions(interaction));
                        }
                        await CustomPlaylistUtil.playCustomPlaylist(queue, id)
                            .then(async () => {
                                embed = EmbedUtil.getDefaultEmbed(`Custom playlist **${id}** queued successfully.`);
                                try {
                                    if (!queue.connection && interaction.member instanceof GuildMember) {
                                        await queue.connect(interaction.member.voice.channel);
                                    }
                                } catch (error: any) {
                                    const embed = EmbedUtil.getErrorEmbed("Unable to join your voice channel.");
                                    await player.deleteQueue(interaction.guild);
                                    await queue.destroy(true);
                                    return void await interaction.editReply({embeds: [embed]});
                                }
                                await queue.play();
                                MusicPlayer.setPlaying(queue, true);
                            })
                            .catch(async () => {
                                embed = EmbedUtil.getErrorEmbed("A custom playlist by that ID was not found.");
                            });
                        return void await interaction.editReply({embeds: [embed]});
                    case "addtrack":
                       id = interaction.options.getString("id");
                       track = interaction.options.getString("track");
                       const result = await CustomPlaylist.findOne({playlistId: id, userId: interaction.user.id});
                       if (!result) return await interaction.editReply({content: "A custom playlist by that ID doesn't exist."});
                       await CustomPlaylistUtil.addTrackToCustomPlaylist(interaction.user.id, track, id, result)
                           .then(async data => {
                               if (!data.status) return await interaction.editReply({content: "You cannot add multiple tracks to custom playlists at once."});
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
                               return await interaction.editReply({content: "An error ocurred while running this."});
                           });
                       break;
                    case "removetrack":
                }
            } catch (error: any) {

            }
        }
    }

    public getSlashData(): object {
        return this.slashData;
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "create",
                description: "Create a custom playlist.",
                type: ApplicationCommandOptionTypes.SUB_COMMAND,
                required: false,
                autocomplete: false,
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
                required: false,
                autocomplete: false,
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
                required: false,
                autocomplete: false,
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
                required: false,
                autocomplete: false,
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
                required: false,
                autocomplete: false,
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
                        description: "The track to remove from the playlist.",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                        autocomplete: true
                    }
                ],
            }
        ],
    }
}