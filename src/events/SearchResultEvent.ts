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
                       })).slice(0, 10 - 1))
                    });
        }
    }
}