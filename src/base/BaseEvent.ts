import {Client} from "discord.js";
import ReadyEvent from "../events/ReadyEvent";
import BaseResponder from "./BaseResponder";
import SearchResultEvent from "../events/SearchResultEvent";
import MessageEvent from "../events/MessageEvent";
import DatabaseUtil from "../utils/DatabaseUtil";
import ButtonClickEvent from "../events/ButtonClickEvent";

export default class BaseEvent {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.initAllEvents().then(() => {});
    }

    private async initAllEvents(): Promise<any> {
        this.client
            .on("ready", async () => {
                await new ReadyEvent(this.client, "ready", true).execute();
            })
            .on("messageCreate", async message => {
                await new MessageEvent(this.client, "messageCreate", false).execute(message);
            })
            .on("interactionCreate", async interaction => {
                if (interaction.isCommand()) {
                    await DatabaseUtil.addExecutedCommand(1);
                    await BaseResponder.respondToApplicationCommands(this.client, interaction);
                } else if (interaction.isButton()) {
                    await new ButtonClickEvent(this.client, "interactionCreate", false).execute(interaction);
                } else if (interaction.isAutocomplete()) {
                    await new SearchResultEvent(this.client, "interactionCreate", false).execute(interaction);
                }
            });
    }
}