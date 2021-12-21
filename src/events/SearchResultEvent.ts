import {Client, ClientEvents, Interaction} from "discord.js";
import {IEvent} from "../interfaces/IEvent";
import {player} from "../Elixir";

export default class SearchResultEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(interaction: Interaction) {
        if (!interaction.isAutocomplete()) return;
        const focused = interaction.options.getFocused() as string;
        switch (interaction.commandName) {
            case "search":
                if (focused === "" || focused.startsWith(" ")) {
                    return await interaction.respond([
                        {
                            name: "No results found.",
                            value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        }
                    ]);
                }
                await player.search(focused, {requestedBy: interaction.user})
                    .then(async result => {
                       return await interaction.respond(result.tracks.map(track => ({
                           name: track.title,
                           value: track.url
                       })))
                    });
        }
    }
}