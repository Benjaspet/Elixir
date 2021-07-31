const Discord = require("discord.js");
const client = require("../Elixir");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "play") {

        const song = interaction.options.getString("song");
        const skip = interaction.options.getBoolean("skip");
        const channel = interaction.member?.voice.channel;

        if (!channel) {

            return interaction.reply({embeds: [await client.utils.sendError(`${client.config.emojis.error} You must be in a voice channel.`)]})

        }

        if (channel) {

            await client.player.playVoiceChannel(channel, song)

                .then(() => {

                    const queue = client.player.getQueue(interaction.guild.id);
                    const length = queue.songs.length;

                    if (length === 1) {

                        const embed = new Discord.MessageEmbed()
                            .setDescription(`**Queued:** [${queue.songs[0].name}](${queue.songs[0].url}) [<@${interaction.member.id}>]`)
                            .setColor("PURPLE")
                            .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))

                        interaction.reply({embeds: [embed]});

                    }

                    if (length > 1) {

                        const embed2 = new Discord.MessageEmbed()
                            .setDescription(`**Queued:** [${queue.songs[length - 1].name}](${queue.songs[length - 1].url}) [<@${interaction.member.id}>]`)
                            .setColor("PURPLE")
                            .setFooter("ponjo.club/elixir", client.user.displayAvatarURL({dynamic: true}))

                        interaction.reply({embeds: [embed2]});

                    }



                });

        }

        if (channel && skip === true) {

            await client.player.playVoiceChannel(channel, song, {skip: true});

        }

    }

});