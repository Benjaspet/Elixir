import {ICommand} from "../interfaces/ICommand";
import {Client, CommandInteraction, MessageEmbed} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import CustomPlaylistUtil from "../utils/CustomPlaylistUtil";
import EmbedUtil from "../utils/EmbedUtil";

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
                        if (!res) {
                            const embed: MessageEmbed = EmbedUtil.getErrorEmbed("A playlist by that ID already exists.");
                            return void await interaction.editReply({embeds: [embed]});
                        } else {
                            const embed: MessageEmbed = EmbedUtil.getDefaultEmbed("Created a custom playlist with ID **" + id + "**.");
                            return void await interaction.editReply({embeds: [embed]});
                        }
                    case "fetch":
                    case "queue":
                    case "addtrack":
                       id = interaction.options.getString("id");
                       track = interaction.options.getString("track");
                       const data = await CustomPlaylistUtil.addTrackToCustomPlaylist(interaction.user.id, track, id);
                       if (!data) return void await interaction.editReply({content: "A custom playlist by that ID doesn't exist."});
                       const endPosition: number = data.tracks.length >= 10 ? 10 - 1 : data.tracks.length;
                       const list = data.tracks.slice(0, endPosition).map((track, i) => {
                           return `**#${i + 1}** ─ ${track}`;
                       });
                       embed = new MessageEmbed()
                           .setTitle("Success!")
                           .setDescription(`**${id}** was updated successfully.`)
                           .setColor("PURPLE")
                           .addField("Playlist Data", "")
                           .addField("Sample Tracks", list.join("\n"))
                           .setFooter({text: "Elixir Music", iconURL: this.client.user.displayAvatarURL({dynamic: false})})
                           .setTimestamp();
                       return void await interaction.editReply({embeds: [embed]});
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