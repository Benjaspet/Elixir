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

import {ApplicationCommandData, Client, CommandInteraction} from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../structs/Command";

export default class ControlsCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("controls", {
            name: "controls",
            description: "Access Elixir's control panel."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        return void await interaction.reply({
            embeds: [EmbedUtil.getControlPanelEmbed(this.client)],
            components: [EmbedUtil.getControlPanelButtons()]
        });
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}