import {ICommand} from "../interfaces/ICommand";
import {Client} from "discord.js";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";

export default class PlaylistCommand implements ICommand {

    public name: string = "playlist";
    public description: string = "Manage custom playlists.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
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