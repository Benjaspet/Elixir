import {Client} from "discord.js";
import ReadyEvent from "../events/ReadyEvent";
import InteractionEvent from "../events/InteractionEvent";
import VoiceStateEvent from "../events/VoiceStateEvent";

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
        this.client.on("interactionCreate", async interaction => {
            await new InteractionEvent(this.client, "interactionCreate", false).execute(interaction);
        });
        this.client.on("voiceStateUpdate", (oldState, newState) => {
            new VoiceStateEvent(this.client, "voiceStateUpdate", false).execute(oldState, newState);
        });
    }
}