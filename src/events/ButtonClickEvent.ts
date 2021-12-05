import {Client, ClientEvents, Interaction} from "discord.js";
import {IEvent} from "../interfaces/IEvent";
import {player} from "../Elixir";
import {isMemberInstance} from "distube";

export default class ButtonClickEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(interaction: Interaction) {
        if (!interaction.isButton()) return;
        if (!isMemberInstance(interaction.member)) return;
        if (!interaction.member.voice.channel) {
            return await interaction.reply({content: "You're not in a voice channel.", ephemeral: true});
        }
        const queue = player.getQueue(interaction.guild.id);
        if (!queue) {
            return await interaction.reply({content: "There is no queue for this guild.", ephemeral: true});
        }
        switch (interaction.customId) {
            case "track-previous":
                try {
                    await player.previous(queue);
                    return await interaction.reply({content: "Now playing the previous song.", ephemeral: true});
                } catch (error) {
                    return await interaction.reply({content: "Unable to perform that action.", ephemeral: true});
                }
            case "track-rewind":
                await player.seek(queue, 0);
                return await interaction.reply({content: "Rewinded the current song.", ephemeral: true});
            case "play-pause":
                if (queue.paused) {
                    await player.resume(queue);
                    return await interaction.reply({content: "Resumed the current song.", ephemeral: true});
                } else {
                    await player.pause(queue);
                    return await interaction.reply({content: "Paused the current song.", ephemeral: true});
                }
            case "fast-forward":
                try {
                    await player.seek(queue, queue.currentTime + 5);
                    return await interaction.reply({content: "Fast-forwarded by 10 seconds.", ephemeral: true});
                } catch (error) {
                    return await interaction.reply({content: "Unable to perform that action.", ephemeral: true});
                }
            case "track-next":
                try {
                    await player.skip(queue);
                    return await interaction.reply({content: "Skipped to the next song.", ephemeral: true});
                } catch (error) {
                    return await interaction.reply({content: "There aren't enough songs in the queue for that.", ephemeral: true});
                }
        }
    }
}