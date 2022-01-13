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

import {Client, MessageActionRow, MessageButton, MessageEmbed, version} from "discord.js";
import {MessageButtonStyles} from "discord.js/typings/enums";
import * as Discord from "discord.js";
import Utilities from "./Utilities";
import DatabaseUtil from "./DatabaseUtil";
import Config from "../structs/Config";
import Vars from "../constants/Vars";
import MusicPlayer from "./MusicPlayer";

export default class EmbedUtil {

    /**
     * Generate a default embed.
     * @param desc The description of the embed.
     * @return MessageEmbed
     */

    public static getDefaultEmbed(desc: string): MessageEmbed {
        return new MessageEmbed()
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription(desc)
    }

    /**
     * Get the help menu embed.
     * @param client The client that instantiated this.
     * @return MessageEmbed
     */

    public static getHelpMenuEmbed(client: Client): MessageEmbed {
        return new MessageEmbed()
            .setTitle("Elixir | Commands")
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription("Mention " + client.user + " to access the control panel.")
            .addField("Music Commands", "```" +
                "play, shuffle, skip, filter, nowplaying, pause, queue, resume, stop, volume, join, previous, lyrics, loop, controls, search" + "```")
            .addField("Informational Commands", "```" + "help, info, invite" + "```")
            .addField("Control Panel", "Elixir now has a fully functional control panel to easily manage " +
                "songs in your server. To use it, simply mention Elixir using `@Elixir`.")
            .setFooter({text: "Elixir Music", iconURL: client.user.displayAvatarURL({dynamic: false})})
            .setTimestamp();
    }

    public static getFaqEmbed(client: Client): MessageEmbed {
        return new MessageEmbed()
            .setTitle("Elixir | FAQ")
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription("Here you can find a list of frequently asked questions about Elixir. If your question is not listed, feel free to ask it in [our support server](https://ponjo/club/discord).")
            .addField("Where should I report bugs?", "You can report bugs, typos, or other issues on [our Discord support server](https://ponjo.club/discord).")
            .addField("I'm having issues with audio quality.", "Most likely, this is an issue with your internet connection. Make sure there is nothing blocking the connection between you and your router.")
            .addField("Why aren't commands in my server?", "This is because you used an older link to invite Elixir. You can re-authorize slash commands [here](" + Config.get("INVITE") + ").")
            .addField("How do I contribute to the bot?", "If you'd like to contribute to Elixir, that's great! Don't hesitate to send an email to [benpetrillo@ponjo.club](mailto:benpetrillo@ponjo.club) or to contact me on Discord at `Eerie#6560`.")
            .addField("Where are your Terms/Privacy Policy?", "You can view more information about Elixir's official Terms of Conditions & Privacy Policy by running `/help terms`.")
            .setFooter({text: "Elixir Music", iconURL: client.user.displayAvatarURL({dynamic: false})})
            .setTimestamp();
    }

    public static getInviteEmbed(): MessageEmbed {
        return new MessageEmbed()
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription("You can invite Elixir to your own server by [clicking here](" + Config.get("INVITE") + ").")
    }

    public static getSupportServerEmbed(): MessageEmbed {
        return new MessageEmbed()
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription("If you'd like to join Elixir's support server, [click here](https://ponjo.club/discord).")
    }

    public static getErrorEmbed(desc: string): MessageEmbed {
        return new Discord.MessageEmbed()
            .setDescription(Config.get("EMOJI-ERROR") + " " + desc)
            .setColor("RED");
    }

    public static getTermsEmbed(client: Client): MessageEmbed {
        return new MessageEmbed()
            .setTitle("Terms, Privacy, & Disclaimer")
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .addField("Disclaimer", "Elixir is an advanced music bot for your server. Elixir is in no way affiliated with the music " +
                "it can play. All songs, albums, tracks, podcasts, and other works belong to their respective creators " +
                "and are not property of Elixir.")
            .addField("Terms of Service", "Your access to and use of the service is conditioned on your acceptance of and compliance with " +
                "Elixir's terms. These terms apply to all visitors, users and others who access or use the service." +
                "The service may contain links to third party web sites or services that are not owned or controlled by Elixir. " +
                "Elixir has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites " +
                "or services. We do not warrant the offerings of any of these entities/individuals or their websites. To view the full terms, " +
                "[click here](https://ponjo.club/terms/Elixir).")
            .addField("Privacy Policy", "All data stored by Elixir is exclusively secured within our United States servers. While some " +
                "of our other services use servers across the globe, data stored by Elixir is restricted to the United States. All data is " +
                "secured and regularly backed up for privacy and to provide the best experience for users of the bot. " +
                "We only retain data for as long as deemed necessary for the purposes outlined in this Privacy Policy. " +
                "Upon sending a request to delete your data, we will proceed with " +
                "the process, and all data we store with respect to you, will be deleted promptly. To view more on Elixir's Privacy Policy, " +
                "[click here](https://ponjo.club/privacy/elixir).")
            .setFooter({text: "Elixir Music", iconURL: client.user.displayAvatarURL({dynamic: false})})
            .setTimestamp();
    }

    public static async getInformationEmbed(client: Client): Promise<MessageEmbed> {
        return new MessageEmbed()
            .setTitle("Elixir | Information")
            .setAuthor({name: "Total Playing Streams: " + MusicPlayer.getOngoingStreamCount().toString()})
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription("" +
                Config.get("EMOJI-LIBRARIES") + " Powered by: Discord.js " + version + "\n" +
                Config.get("EMOJI-SERVERS") + " Server count: " + Utilities.getTotalElixirServerCount(client) + "\n" +
                Config.get("EMOJI-USERS") + " User count: " + Utilities.getTotalElixirMemberCount(client) + "\n" +
                Config.get("EMOJI-WEBSOCKET") + " Websocket latency: " + Utilities.getWebsocketLatency(client) + "ms" + "\n" +
                Config.get("EMOJI-UPTIME") + " Uptime: " + Utilities.getProcessUptime() + "\n" +
                Config.get("EMOJI-COMMANDS") + " Commands ran: " + Utilities.cleanFormat(await DatabaseUtil.getTotalCommandsExecuted()) + "\n" +
                Config.get("EMOJI-SONGS") + " Songs played: " + Utilities.cleanFormat(await DatabaseUtil.getTotalSongsPlayed()) + "\n" +
                Config.get("EMOJI-PLAYLISTS") + " Playlists queued: " + Utilities.cleanFormat(await DatabaseUtil.getTotalPlaylistsQueued()) + "\n" +
                Config.get("EMOJI-DEVELOPER") + " Bot Developer: Eerie#6560")
            .addField("Extra Data", "" +
                    "• Verified: " + client.user.verified)
            .setFooter({text: "Elixir Music", iconURL: client.user.displayAvatarURL({dynamic: false})})
            .setTimestamp()
    }

    /**
     * Get the row of control panel buttons.
     * @return MessageActionRow
     */

    public static getControlPanelButtons(): MessageActionRow {
        return new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("track-previous")
                    .setStyle(MessageButtonStyles.SECONDARY)
                    .setEmoji("⏮️"),
                new MessageButton()
                    .setCustomId("play-pause")
                    .setStyle(MessageButtonStyles.SECONDARY)
                    .setEmoji("⏯️"),
                new MessageButton()
                    .setCustomId("track-next")
                    .setStyle(MessageButtonStyles.SECONDARY)
                    .setEmoji("⏭️")
            );
    }

    /**
     * Get the control panel embed, with message components.
     * @param client The client that instantiated this.
     * @return MessageEmbed
     */

    public static getControlPanelEmbed(client: Client): MessageEmbed {
        return new MessageEmbed()
            .setTitle("Elixir | Control Panel")
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription("Welcome to Elixir's control panel! Here, you can manage your entire music queue. You'll " +
                "easily be able to control your music using the buttons below. Current features include playing tracks, " +
                "pausing tracks, rewinding tracks, fast-forwarding tracks, going to the previous track, and going to the " +
                "next track.")
            .setFooter({text: "Elixir Music", iconURL: client.user.displayAvatarURL()})
            .setTimestamp();
    }
}