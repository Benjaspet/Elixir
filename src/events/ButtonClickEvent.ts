import {ButtonInteraction, Client, ClientEvents, GuildMember} from "discord.js";
import {IEvent} from "../interfaces/IEvent";
import {Queue} from "discord-player";
import {player} from "../Elixir";
import Logger from "../Logger";
import EmbedUtil from "../utils/EmbedUtil";
import MusicPlayer from "../utils/MusicPlayer";

export default class ButtonClickEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(interaction: ButtonInteraction): Promise<any> {
        if (!interaction.isButton()) return;
        try {
            const queue: Queue = player.getQueue(interaction.guild);
            const member = interaction.member;
            if (member instanceof GuildMember) {
                if (!queue) {
                    return await interaction.reply({content: "There's no queue in this server.", ephemeral: true});
                } else if (!member.voice.channel) {
                    return await interaction.reply({content: "You must be in a voice channel.", ephemeral: true});
                } else {
                    switch (interaction.customId) {
                        case "track-previous":
                            try {
                                await queue.back();
                                return await interaction.reply({content: "Now playing the previous song.", ephemeral: true});
                            } catch (error: any) {
                                return await interaction.reply({content: "Unable to perform that action.", ephemeral: true});
                            }
                        case "track-rewind":
                            try {
                                await queue.seek(0);
                                return await interaction.reply({content: "Rewinded the current song.", ephemeral: true});
                            } catch (error: any) {
                                return await interaction.reply({content: "Unable to perform that action.", ephemeral: true});
                            }
                        case "play-pause":
                            try {
                                if (MusicPlayer.isPlaying(queue)) {
                                    queue.setPaused(true);
                                    MusicPlayer.setPlaying(queue, false);
                                    return await interaction.reply({content: "Paused the current song.", ephemeral: true});
                                } else {
                                    queue.setPaused(false);
                                    MusicPlayer.setPlaying(queue, true);
                                    return await interaction.reply({content: "Resumed the current song.", ephemeral: true});
                                }
                            } catch (error: any) {
                                return await interaction.reply({content: "Unable to perform that action.", ephemeral: true});
                            }
                        case "fast-forward":
                            try {
                                await queue.seek(queue.streamTime + 5000);
                                return await interaction.reply({content: "Fast-forwarded by 5 seconds.", ephemeral: true});
                            } catch (error: any) {
                                return await interaction.reply({content: "Unable to perform that action.", ephemeral: true});
                            }
                        case "track-next":
                            try {
                                queue.skip();
                                return await interaction.reply({content: "Skipped to the next track.", ephemeral: true});
                            } catch (error: any) {
                                return await interaction.reply({content: "There aren't enough tracks in the queue for that.", ephemeral: true});
                            }
                    }
                }
            } else {
                return await interaction.reply({content: "This command must be run in a guild."});
            }
        } catch (error: any) {
            Logger.error(error);
            const embed = EmbedUtil.getErrorEmbed("An error ocurred while performing this action.");
            return await interaction.reply({embeds: [embed]});
        }
    }
}