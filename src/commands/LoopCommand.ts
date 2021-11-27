import {Client} from "discord.js";
import {RepeatMode} from "distube";
import {Command} from "../interfaces/Command";
import {player} from "../Elixir";
import DatabaseUtil from "../utils/DatabaseUtil";
import EmbedUtil from "../utils/EmbedUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";

export default class LoopCommand implements Command {

    public name: string = "loop";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Loop a song or queue.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            try {
                DatabaseUtil.addExecutedCommand(1);
                const mode = interaction.options.getInteger("mode");
                const channel = interaction.member?.voice.channel;
                const queue = player.getQueue(interaction.guild.id);
                if (!channel) {
                    return interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "You must be in a voice channel to run this command.")]});
                }
                if (!queue) {
                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                            "error", "There is no queue for the server.")]});
                }
                switch (mode) {
                    case RepeatMode.QUEUE:
                        player.setRepeatMode(interaction.guild.id, mode);
                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                "default", "Set the loop mode to **queue**.")]});
                    case RepeatMode.SONG:
                        player.setRepeatMode(interaction.guild.id, mode);
                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                "default", "Set the loop mode to **song**.")]});
                    case RepeatMode.DISABLED:
                        player.setRepeatMode(interaction.guild.id, mode);
                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                                "default", "Loop mode has been disabled.")]});
                }
            } catch (error) {
                console.log(error)
                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client,
                        "error", "The song is already paused.")]});
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