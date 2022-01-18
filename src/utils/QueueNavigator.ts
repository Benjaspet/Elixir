import {Client, CommandInteraction, MessageEmbed} from "discord.js";
import {Queue} from "discord-player";
import Vars from "../constants/Vars";

export default class QueueNavigator {

    /**
     * Create a queue embed with button pagination.
     * @param queue The track queue to use.
     * @param interaction The interaction object to use.
     * @param client The client that instantiated this.
     * @return Promise<void>
     */

    public static createQueueEmbed(queue: Queue, interaction: CommandInteraction, client: Client): void {

        const tracks: string[] = queue.tracks.slice(0, 15).map((track, i) => {
            const title: string = queue.tracks[i].title;
            const reducedTitle: string = title.length > 60 ? title.substring(0, 60) + "..." : title;
            return `**${i + 1}**. [${reducedTitle}](${track.url}) (${track.duration})`;
        });
        const queueLength = queue.tracks.length;
        const embed: MessageEmbed = new MessageEmbed()
            .setDescription(`${tracks.join("\n")}${queueLength > 20 ? `\n\n...${queueLength - 15} more track(s).` : ""}`)
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setFooter({text: "Elixir Music", iconURL: client.user.displayAvatarURL({dynamic: false})})
            .setTimestamp();
        return void interaction.reply({embeds: [embed]});
    }
}