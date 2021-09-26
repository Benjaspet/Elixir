import * as Discord from "discord.js";
import config from "../resources/Config";
import ElixirUtil from "./ElixirUtil";
import DatabaseUtil from "./DatabaseUtil";
import {version} from "discord.js";

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
                    .setDescription(`Below you can find all available commands. Elixir has fully adapted to built-in slash commands for version 3.0. If you'd like to use this bot in your own server, [invite Elixir here](${config.invite}). If you do not have access to Elixir's slash commands in your server, enable them by [clicking here](${config.invite}).`)
                    .addField("Music Commands", "```" +
                        "play, shuffle, skip, filter, nowplaying, pause, queue, resume, stop, volume, join" + "```")
                    .addField("Informational Commands", "```" + "help, info, invite" + "```")
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
            case "help-faq":
                return new Discord.MessageEmbed()
                    .setTitle("Elixir | FAQ")
                    .setColor("PURPLE")
                    .setDescription("Here you can find a list of frequently asked questions about Elixir. If your question is not listed, feel free to ask it in [our support server](https://ponjo/club/discord).")
                    .addField("Where should I report bugs?", "You can report bugs, typos, or other issues on [our Discord support server](https://ponjo.club/discord).")
                    .addField("I'm having issues with audio quality.", "Most likely, this is an issue with your internet connection. Make sure there is nothing blocking the connection between you and your router.")
                    .addField("What's Elixir's prefix?", "Elixir no longer has a custom prefix system. Due to the addition of the message content intent, Elixir now fully supports built-in slash commands.")
                    .addField("How do I contribute to the bot?", "If you'd like to contribute to Elixir, that's great! Don't hesitate to send an email to [eerie@ponjo.club](mailto:benpetrillo@ponjo.club) or to contact me on Discord at `Eerie#6560`.")
                    .addField("Where are your Terms/Privacy Policy?", "You can view more information about Elixir's official Terms of Conditions & Privacy Policy by running `/help terms`.")
            case "info":
                return new Discord.MessageEmbed()
                    .setTitle("Elixir | Information")
                    .setColor("PURPLE")
                    .setDescription("" +
                        config.emojis.developer + " Developer: Eerie#6560" + "\n" +
                        config.emojis.libraries + " Powered by: Spotify API REST V2" + "\n" +
                        config.emojis.servers + " Server count: " + ElixirUtil.getTotalElixirServerCount(client) + "\n" +
                        config.emojis.users + " User count: " + ElixirUtil.getTotalElixirMemberCount(client) + "\n" +
                        config.emojis.websocket + " Websocket latency: " + ElixirUtil.getWebsocketLatency(client) + "ms" + "\n" +
                        config.emojis.uptime + " Uptime: " + ElixirUtil.getProcessUptime() + "\n" +
                        config.emojis.commands + " Commands ran: " + DatabaseUtil.getTotalCommandsExecuted() + "\n" +
                        config.emojis.songs + " Songs played: " + DatabaseUtil.getTotalSongsPlayed() + "\n" +
                        config.emojis.playlists + " Playlists queued: " + DatabaseUtil.getTotalPlaylistsPlayed() + "\n\n" +
                        "Discord.js Version: " + version + "\n" +
                        "Bot Version: " + ElixirUtil.getVersion())
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
            case "help-terms":
                return new Discord.MessageEmbed()
                    .setTitle("Terms, Privacy, & Disclaimer")
                    .addField("Disclaimer", "Elixir is an advanced music bot for your server. Elixir is structured around the Spotify Web API and is " +
                        "in no way affiliated with it. All songs, albums, tracks, podcasts, and other works belong to their respective creators " +
                        "and are not property of Elixir. If you'd like to inquire about our use of the Spotify API, you may do so by sending an email " +
                        "to `benpetrillo@ponjo.club`.")
                    .addField("Terms of Service", "Your access to and use of the service is conditioned on your acceptance of and compliance with " +
                        "Elixir's terms. These terms apply to all visitors, users and others who access or use the service." + "\n\n" +
                        "The service may contain links to third party web sites or services that are not owned or controlled by Elixir. " +
                        "Elixir has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third party web sites " +
                        "or services. We do not warrant the offerings of any of these entities/individuals or their websites. To view the full terms, " +
                        "[click here](https://ponjo.club/terms/Elixir).")
                    .addField("Privacy Policy", "All data stored by Elixir is exclusively secured within our United States servers. While some " +
                        "of our other services use servers across the globe, data stored by Elixir is restricted to the United States. All data is " +
                        "secured and regularly backed up for privacy and to provide the best experience for users of the bot. It is important for you, " +
                        "the user, to know that we only retain data for as long as deemed necessary for the purposes outlined in this Privacy Policy. " +
                        "Upon identity verification that it is indeed you, the user, who is requesting to have your data deleted, we will proceed with " +
                        "the process and all data we store with respect to you, will be deleted promptly. To view more on Elixir's Privacy Policy, " +
                        "[click here](https://ponjo.club/privacy/elixir).")
                    .setColor("PURPLE")
            case "error":
                return new Discord.MessageEmbed()
                    .setDescription(config.emojis.error + " " + input)
                    .setColor("RED")
        }
    }
}