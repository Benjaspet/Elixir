const Discord = require("discord.js");
const client = require("../Elixir");
const {deployAllSlashCommands} = require("../slash/SlashBase");

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "queue") {

        const queue = client.player.getQueue(interaction.guild.id);

        const embed = new Discord.MessageEmbed()
            .setTitle(`Queue for ${interaction.guild.name}`)
            .setColor("PURPLE")
            .setFooter(`ponjodevelopment.tk`, client.user.displayAvatarURL({dynamic: true}))

        let counter = 0;

        for (let i = 0; i < queue.songs.length; i += 20) {

            if (counter >= 10) break;
            embed.setDescription("" + queue.songs.map((song, id) =>
                `**#${id+1}** - [${song.name}](${song.url}) - ${song.formattedDuration}`).join("\n"));
            counter++;
            
        }

        await interaction.reply({embeds: [embed]});

    }

});