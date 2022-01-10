import {IEvent} from "../interfaces/IEvent";
import {Client, ClientEvents, Message, PartialMessage} from "discord.js";
import Logger from "../Logger";
import Utilities from "../utils/Utilities";

export default class MessageDeleteEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(message: Message<boolean>|PartialMessage): Promise<void> {
        try {
            return;
        } catch (error: any) {
            Logger.error(error);
            Utilities.sendWebhookMessage(error, true, message.guild.id);
            return;
        }
    }
}