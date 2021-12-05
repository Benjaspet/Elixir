import {Client} from "discord.js";
import {RepeatMode} from "distube";
import {ICommand} from "../interfaces/ICommand";
import {player} from "../Elixir";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Logger from "../Logger";

export default class LoopCommand implements ICommand {

    public name: string = "loop";
    public description: string = "Loop a song or queue.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                const mode = interaction.options.getInteger("mode");
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("There is no queue for the server.")]});
                }
                switch (mode) {
                    case RepeatMode.QUEUE:
                        player.setRepeatMode(interaction.guild.id, mode);
                        return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **queue**.")]});
                    case RepeatMode.SONG:
                        player.setRepeatMode(interaction.guild.id, mode);
                        return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Set the loop mode to **song**.")]});
                    case RepeatMode.DISABLED:
                        player.setRepeatMode(interaction.guild.id, mode);
                        return await interaction.reply({embeds: [EmbedUtil.getDefaultEmbed("Loop mode has been disabled.")]});
                }
            } catch (error) {
                Logger.error(error)
                return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("The song is already paused.")]});
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
                type: SlashCommandUtil.slashCommandTypeToInt("INTEGER"),
                required: true,
                choices: [
                    {
                        name: "Song Loop",
                        value: RepeatMode.SONG
                    },
                    {
                        name: "Queue Loop",
                        value: RepeatMode.QUEUE
                    },
                    {
                        name: "Disable Loop",
                        value: RepeatMode.DISABLED
                    }
                ]
            }
        ]
    };
}