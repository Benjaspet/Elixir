import {CommandInteraction, MessageButton, MessageEmbed} from "discord.js";
import Vars from "../constants/Vars";
import {Queue} from "discord-player";
import pagination from "@acegoal07/discordjs-pagination";

export default class QueueNavigator {

    /**
     * Create a queue embed with button pagination.
     * @param queue The track queue to use.
     * @param interaction The interaction object to use.
     * @return Promise<void>
     */

    public static async createQueueEmbed(queue: Queue, interaction: CommandInteraction): Promise<void> {
        const pages: any[] = [];
        let page: number = 1; let emptyPage: any = false;
        const buttons: MessageButton[] = [
            new MessageButton()
                .setCustomId("previous")
                .setLabel("Previous")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle("SUCCESS")
        ];
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.slice(pageStart, pageEnd).map((track, i) => {
                return `**${i + 1 + pageStart}.** ─ [${track.title}](${track.url})`;
            });
            if (tracks.length) {
                const queueLength = queue.tracks.length;
                const embed = new MessageEmbed();
                embed.setDescription(`${tracks.join("\n")}${queueLength > pageEnd ? `\n\n...${queueLength - pageEnd} more track(s).` : ""}`);
                embed.setColor(Vars.DEFAULT_EMBED_COLOR);
                if (page === 1) {
                    embed.setAuthor({name: `Now playing: ${queue.current.title}`, iconURL: null, url: `${queue.current.url}`});
                }
                pages.push(embed);
                page++;
            } else {
                emptyPage = 1;
                if (page === 1) {
                    const embed = new MessageEmbed();
                    embed.setColor(Vars.DEFAULT_EMBED_COLOR);
                    embed.setDescription("There are no songs in the queue.");
                    embed.setAuthor({name: `Now playing: ${queue.current.title}`, iconURL: null, url: `${queue.current.url}`});
                    return await interaction.reply({embeds: [embed]});
                }
                if (page === 2) {
                    return interaction.reply({embeds: [pages[0]]});
                }
            }
        } while (!emptyPage);
        return pagination({interaction, pages, buttons});
    }
}