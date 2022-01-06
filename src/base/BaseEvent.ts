import {Client} from "discord.js";
import ReadyEvent from "../events/ReadyEvent";
import MessageEvent from "../events/MessageEvent";
import InteractionEvent from "../events/InteractionEvent";
import MessageDeleteEvent from "../events/MessageDeleteEvent";

export default class BaseEvent {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.initAllEvents().then(() => {});
    }

    private async initAllEvents(): Promise<any> {
        this.client.on("ready", async () => {
            await new ReadyEvent(this.client, "ready", true).execute();
        });
        this.client.on("messageCreate", async message => {
            await new MessageEvent(this.client, "messageCreate", false).execute(message);
        });
        this.client.on("messageDelete", async message => {
           await new MessageDeleteEvent(this.client, "messageDelete", false).execute(message);
        });
        this.client.on("interactionCreate", async interaction => {
            await new InteractionEvent(this.client, "interactionCreate", false).execute(interaction);
        });
    }
}