import * as Discord from "discord.js";
import config from "../resources/Config";
import ElixirUtil from "./ElixirUtil";

export default class EmbedUtil {

    public static fetchEmbedByType(client, type: string) {

        switch (type) {

            case "help-default":

                return new Discord.MessageEmbed()
                    .setTitle("Elixir Help")
                    .setColor("PURPLE")
                    .setDescription(`Below you can find all available commands. Please note that, due to an API update, traditional prefix commands are no longer supported, and Elixir has fully adapted to built-in slash commands for version 3.0. If you'd like to use this bot in your own server, [invite Elixir here](${config.invite})! If you do not have access to Elixir's slash commands in your server, enable them by [clicking here](${config.invite}).`)
                    .addField("Music Commands", "```" +
                        "play, autoplay, shuffle, skip, filter, forward, loop, lyrics, nowplaying, pause, queue, resume, rewind, stop, volume, seek" + "```")
                    .addField("Informational Commands", "```" + "help, info, ping, changelog, invite" + "```")
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

            case "help-faq":

                return new Discord.MessageEmbed()
                    .setTitle("Elixir | FAQ")
                    .setColor("PURPLE")
                    .setDescription("WIP")

            case "info":

                return new Discord.MessageEmbed()
                    .setTitle("Elixir | Information")
                    .setColor("PURPLE")
                    .setDescription("" +
                        config.emojis.developer + " **Developer:** Eerie#6560" + "\n" +
                        config.emojis.servers + " **Server count:** " + ElixirUtil.getTotalElixirServerCount(client) + "\n" +
                        config.emojis.users + " **User count:** " + ElixirUtil.getTotalElixirMemberCount(client))
                    .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

            case "error":

                return new Discord.MessageEmbed()
                    .setDescription(config.emojis.error + "An error occurred.")
                    .setColor("RED")
        }
    }
}