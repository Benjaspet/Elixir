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
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../structs/Command";

export default class HelpCommand extends Command {

    private readonly client: Client;

    constructor(client: Client) {
        super("help", {
            name: "help",
            description: "Displays a list of all available commands for Elixir.",
            options: [
                {
                    name: "category",
                    description: "Learn how to use Elixir and its commands.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: false,
                    choices: [
                        {
                            name: "Frequently Asked Questions",
                            value: "help-faq"
                        },
                        {
                            name: "How to Invite Elixir to Your Server",
                            value: "help-invite"
                        },
                        {
                            name: "Join Elixir's Support Server",
                            value: "help-support"
                        },
                        {
                            name: "How to Use Commands",
                            value: "help-commands"
                        },
                        {
                            name: "Disclaimer, Terms, & Privacy Policy",
                            value: "help-terms"
                        }
                    ]
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        switch (interaction.options.getString("category")) {
            case "help-faq":
                return void await interaction.reply({
                    embeds: [EmbedUtil.getFaqEmbed(this.client)]
                });
            case "help-invite":
                return void await interaction.reply({
                    embeds: [EmbedUtil.getInviteEmbed()]
                });
            case "help-support":
                return void await interaction.reply({
                    embeds: [EmbedUtil.getSupportServerEmbed()]
                });
            case "help-commands":
                return void await interaction.reply({
                    embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]
                });
            case "help-terms":
                return void await interaction.reply({
                    embeds: [EmbedUtil.getTermsEmbed(this.client)]
                });
            default:
                return void await interaction.reply({
                    embeds: [EmbedUtil.getHelpMenuEmbed(this.client)]
                });
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}