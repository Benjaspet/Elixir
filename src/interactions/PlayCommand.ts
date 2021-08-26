import * as Discord from "discord.js";
import player from "../managers/MusicManager";
import premiumUsers from "../resources/PremiumUsers";
import EmbedUtil from "../utils/EmbedUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "play") {

            const song = interaction.options.getString("song");
            const skip = interaction.options.getBoolean("skip");
            const channel = interaction.member?.voice.channel;

            if (!channel) {

                return interaction.reply({embeds: [await EmbedUtil.fetchEmbedByType(client, "error", "You must be in a voice channel to run this command.")]});

            }

            if (song.isLive && !premiumUsers.includes(interaction.member.id)) {

                const embed = new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription("You must be a premium user to play livestreams! If you'd like to become one, join our official Discord server and make a ticket.")

                return await interaction.reply({embeds: [embed]});

            }

            if (channel) {

                const embed = new Discord.MessageEmbed()
                    .setTitle("Searching the songbase...")
                    .setColor("PURPLE")
                    .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                interaction.reply({embeds: [embed]});

                await player.playVoiceChannel(channel, song, {textChannel: interaction.channel});

            }

            if (channel && skip === true) {

                const embed = new Discord.MessageEmbed()
                    .setTitle("Searching the songbase...")
                    .setColor("PURPLE")
                    .setFooter(`Requested by: ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                interaction.reply({embeds: [embed]});

                await player.playVoiceChannel(channel, song, {skip: true, textChannel: interaction.channel});

            }

        }


    }
}