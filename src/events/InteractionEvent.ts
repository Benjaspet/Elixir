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

import {IEvent} from "../interfaces/IEvent";
import {
    ButtonInteraction,
    Client,
    ClientEvents,
    CommandInteraction,
    GuildMember,
    Interaction, MessageEmbed
} from "discord.js";
import SearchResultEvent from "./SearchResultEvent";
import EmbedUtil from "../utils/EmbedUtil";
import CommandManager from "../managers/CommandManager";
import {ApplicationCommand} from "../types/ApplicationCommand";

export default class InteractionEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.inGuild()) {
            if (interaction.isCommand()) {
                if (interaction.member instanceof GuildMember) {
                    const name: string = interaction.commandName;
                    const command: ApplicationCommand = CommandManager.commands.get(name);
                    if (command != null && interaction.isCommand()) {
                        command.execute(interaction);
                    }
                }
            } else if (interaction.isAutocomplete()) {
                void await new SearchResultEvent(this.client, "interactionCreate", false).execute(interaction);
            }
        } else {
            const embed: MessageEmbed = EmbedUtil.getDefaultEmbed("Unfortunately, Elixir Music only supports " +
                "guild commands at this time. You can only execute commands in a server, and not in direct messages " +
                "for the time being.")
            if (interaction instanceof CommandInteraction || interaction instanceof ButtonInteraction) {
                return void await interaction.reply({embeds: [embed]});
            } else return;
        }
    }
}