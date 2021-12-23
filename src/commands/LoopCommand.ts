import {Client, CommandInteraction, GuildMember} from "discord.js";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Logger from "../Logger";
import {Queue, QueueRepeatMode} from "discord-player";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";

export default class LoopCommand implements ICommand {

    public name: string = "loop";
    public description: string = "Loop a song or queue.";
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
                const mode = interaction.options.getInteger("mode");
                if (member instanceof GuildMember) {
                    if (!queue) {
                        const embed = EmbedUtil.getErrorEmbed("There's no queue in this server.");
                        return void await interaction.reply({embeds: [embed]});
                    } else if (!member.voice.channel) {
                        const embed = EmbedUtil.getErrorEmbed("You must be in a voice channel.");
                        return void await interaction.reply({embeds: [embed]});
                    } else {
                        switch (mode) {
                            case QueueRepeatMode.TRACK:
                                queue.setRepeatMode(QueueRepeatMode.TRACK);
                                return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **track**.")]});
                            case QueueRepeatMode.QUEUE:
                                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                                return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **queue**.")]});
                            case QueueRepeatMode.AUTOPLAY:
                                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                                return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **autoplay**.")]});
                            case QueueRepeatMode.OFF:
                                queue.setRepeatMode(QueueRepeatMode.OFF);
                                return void await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Turned **off** repeat mode.")]});
                        }
                    }
                } else {
                    return void await interaction.reply({content: "This command must be run in a guild."});
                }
            } catch (error) {
                Logger.error(error);
                const embed = EmbedUtil.getErrorEmbed("An error ocurred while running this command.");
                return void await interaction.reply({embeds: [embed]});
            }
        }
    }

    public getSlashData(): object {
        return this.slashData;
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "mode",
                description: "The type of loop to apply.",
                type: ApplicationCommandOptionTypes.INTEGER,
                required: true,
                choices: [
                    {
                        name: "Track Loop",
                        value: QueueRepeatMode.TRACK
                    },
                    {
                        name: "Queue Loop",
                        value: QueueRepeatMode.QUEUE
                    },
                    {
                        name: "Autoplay",
                        value: QueueRepeatMode.AUTOPLAY
                    },
                    {
                        name: "Disable Loop",
                        value: QueueRepeatMode.OFF
                    }
                ]
            }
        ]
    };
}