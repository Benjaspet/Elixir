import {IEvent} from "../interfaces/IEvent";
import {Client, ClientEvents} from "discord.js";
import Logger from "../Logger";
import Config from "../Config";
import Utilities from "../utils/Utilities";
import BaseCommand from "../base/BaseCommand";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import DatabaseManager from "../managers/DatabaseManager";
import DatabaseUtil from "../utils/DatabaseUtil";
import CommandManager from "../managers/CommandManager";

export default class ReadyEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(): Promise<void> {
        Logger.clear();
        Logger.info(`Logged in as ${this.client.user.tag}.`);
        this.handlePresence();
        new CommandManager(this.client);
        await this.handleApplicationCommands();
        await DatabaseManager.connect();
        if (JSON.parse(Config.get("MONGO-SETUP")) == true) {
            await DatabaseUtil.initializeCollections();
        }
        require("./PlayerListener");
    }

    private handlePresence(): void {
        this.updatePresence()
            .then(() => setInterval(() => this.updatePresence(), 500 * 1000))
            .catch(() => this.handlePresence())
        return undefined;
    }

    private async updatePresence(): Promise<void> {
        const activity = Config.get("ACTIVITY").replace("{users}", Utilities.getTotalElixirMemberCount(this.client));
        this.client.user.setActivity({type: "LISTENING", name: activity});
    }

    private async handleApplicationCommands() {
        if (JSON.parse(Config.get("DEPLOY-APPLICATION-COMMANDS-GUILD")) == true) {
            await new BaseCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: true,
                delete: false,
                guild: true
            });
        } else if (JSON.parse(Config.get("DEPLOY-APPLICATION-COMMANDS-GLOBAL")) == true) {
            await new BaseCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: true,
                delete: false,
                guild: false
            });
        } else if (JSON.parse(Config.get("DELETE-APPLICATION-COMMANDS-GUILD")) == true) {
            await new BaseCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: false,
                delete: true,
                guild: true
            });
        } else if (JSON.parse(Config.get("DELETE-APPLICATION-COMMANDS-GLOBAL")) == true) {
            await new BaseCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: false,
                delete: true,
                guild: false
            });
        } else {
            Logger.info("Application commands loaded.");
        }
    }
}