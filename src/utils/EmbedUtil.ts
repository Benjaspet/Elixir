import * as Discord from "discord.js";
import config from "../resources/Config";
import ElixirUtil from "./ElixirUtil";
import DatabaseUtil from "./DatabaseUtil";

export default class EmbedUtil {

    public static fetchEmbedByType(client, type: string, input?: string) {

        switch (type) {

            case "default":

                return new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription(input)

            case "help-default":

                return new Discord.MessageEmbed()
                    .setTitle("Elixir | Commands")
                    .setColor("PURPLE")
                    .setDescription(`Below you can find all available commands. Please note that, due to an API update, traditional prefix commands are no longer supported, and Elixir has fully adapted to built-in slash commands for version 3.0. If you'd like to use this bot in your own server, [invite Elixir here](${config.invite})! If you do not have access to Elixir's slash commands in your server, enable them by [clicking here](${config.invite}).`)
                    .addField("Music Commands", "```" +
                        "play, shuffle, skip, filter, nowplaying, pause, queue, resume, stop, volume, join" + "```")
                    .addField("Informational Commands", "```" + "help, info, ping, invite" + "```")
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

            case "help-faq":

                return new Discord.MessageEmbed()
                    .setTitle("Elixir | FAQ")
                    .setColor("PURPLE")
                    .setDescription("Here you can find a list of frequently asked questions about Elixir. If your question is not listed, feel free to ask it in [our support server](https://ponjo/club/discord).")
                    .addField("Where should I report bugs?", "You can report bugs, typos, or other issue on [our Discord support server](https://ponjo.club/discord).")
                    .addField("I'm having issues with audio quality.", "Most likely, this is an issue with your internet connection. Make sure there is nothing blocking the connection between you and your router. Keep in mind: livestream support is currently in beta, and issues are expected to occur. If you're sure this isn't the case, you can always report it on our support server.")
                    .addField("What's Elixir's prefix?", "Elixir's used to have a built-in prefix system, but due to the addition of the message content intent, Elixir now fully supports built-in slash commands, and traditional prefix commands are no longer supported.")
                    .addField("How do I contribute to the bot?", "If you'd like to contribute to Elixir, that's great! Don't hesitate to send an email to [eerie@ponjo.club](mailto:eerie@ponjo.club) or to contact me on Discord at `Eerie#6560`.")

            case "info":

                return new Discord.MessageEmbed()
                    .setTitle("Elixir | Information")
                    .setColor("PURPLE")
                    .setDescription("" +
                        config.emojis.developer + " Developer: Eerie#6560" + "\n" +
                        config.emojis.libraries + " Library: Discord.js v13.10" + "\n" +
                        config.emojis.servers + " Server count: " + ElixirUtil.getTotalElixirServerCount(client) + "\n" +
                        config.emojis.users + " User count: " + ElixirUtil.getTotalElixirMemberCount(client) + "\n" +
                        config.emojis.websocket + " Websocket latency: " + ElixirUtil.getWebsocketLatency(client) + "ms" + "\n" +
                        config.emojis.uptime + " Uptime: " + ElixirUtil.getProcessUptime() + "\n" +
                        config.emojis.commands + " Commands ran: " + DatabaseUtil.getTotalCommandsExecuted() + "\n" +
                        config.emojis.songs + " Songs played: " + DatabaseUtil.getTotalSongsPlayed() + "\n" +
                        config.emojis.playlists + " Playlists queued: " + DatabaseUtil.getTotalPlaylistsPlayed())
                    .addField("Recent Updates", "‣ Spotify playlist & URL support." + "\n" + "‣ Fixed an issue with livestream playback." + "\n" + "‣ Added full support for slash commands.")
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

            case "help-invite":

                return new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription("You can invite Elixir to your own server by [clicking here](" + config.invite + ").")

            case "help-support":

                return new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription("If you'd like to join Elixir's support server, [click here](https://ponjo.club/discord).")

            case "error":

                return new Discord.MessageEmbed()
                    .setDescription(config.emojis.error + " " + input)
                    .setColor("RED")
        }
    }
}