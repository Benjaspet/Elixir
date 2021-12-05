import {IEvent} from "../interfaces/IEvent";
import {Client, ClientEvents, Message} from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";

export default class MessageEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(message: Message): Promise<void> {
        if (message.mentions.has(this.client.user)) {
            await message.reply({
                embeds: [EmbedUtil.getControlPanelEmbed(this.client)],
                components: [EmbedUtil.getControlPanelButtons()]})
        }
    }
}