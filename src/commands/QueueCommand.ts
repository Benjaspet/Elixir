import {Client, CommandInteraction, GuildMember, MessageButton, MessageEmbed} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import {Queue} from "discord-player";
import Logger from "../Logger";
import Vars from "../constants/Vars";

const pagination = require("discordjs-button-pagination");

export default class QueueCommand implements ICommand {

    public name: string = "queue";
    public description: string = "View all songs in the queue.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const queue: Queue = player.getQueue(interaction.guild);
                const member = interaction.member;
                if (member instanceof GuildMember) {
                    if (!queue) {
                        const embed = EmbedUtil.getDefaultEmbed("There are no songs in the queue.");
                        return await interaction.reply({embeds: [embed]});
                    }
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
                    const pages: any[] = [];
                    let page = 1;
                    let emptyPage: any = false;
                    do {
                        const pageStart = 10 * (page - 1);
                        const pageEnd = pageStart + 10;
                        const tracks = queue.tracks.slice(pageStart, pageEnd).map((track, i) => {
                            return `**#${i + 1 + pageStart}** ─ [${track.title}](${track.url})`;
                        });
                        if (tracks.length) {
                            const queueLength = queue.tracks.length;
                            const embed = new MessageEmbed();
                            embed.setDescription(`${tracks.join("\n")}${queueLength > pageEnd ? `\n\n...${queueLength - pageEnd} more track(s).` : ""}`);
                            embed.setColor(Vars.DEFAULT_EMBED_COLOR);
                            if (page === 1) {
                                embed.setAuthor(`Now playing: ${queue.current.title}`, null, `${queue.current.url}`);
                            }
                            pages.push(embed);
                            page++;
                        } else {
                            emptyPage = 1;
                            if (page === 1) {
                                const embed = new MessageEmbed();
                                embed.setColor(Vars.DEFAULT_EMBED_COLOR);
                                embed.setDescription("There are no songs in the queue.");
                                embed.setAuthor(`Now playing: ${queue.current.title}`, null, `${queue.current.url}`);
                                return await interaction.reply({embeds: [embed]});
                            }
                            if (page === 2) {
                                return interaction.reply({embeds: [pages[0]]});
                            }
                        }
                    } while (!emptyPage);
                    return pagination(interaction, pages, buttons);
                } else {
                    return await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error: any) {
                Logger.error(error);
                const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
                return await interaction.reply({embeds: [embed]});
            }
        }
    }

    public getSlashData(): object {
        return this.slashData;
    }

    public slashData: object = {
        name: this.name,
        description: this.description
    };
}