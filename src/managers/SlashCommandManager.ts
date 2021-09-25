import {Client} from "discord.js";
import SlashCommandUtil from "../utils/SlashCommandUtil";

export default class SlashCommandManager {

    protected client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async updateAllSlashCommands(client: Client, guild = true): Promise<void> {
        if (guild) {
            await SlashCommandUtil.setAllSlashCommands(client, true);
        }
        if (!guild) {
            await SlashCommandUtil.setAllSlashCommands(client, false);
        }
    }

    public async deleteAllSlashCommands(client: Client, guild = true) {
        if (guild) {
            await SlashCommandUtil.deleteAllSlashCommands(client, true);
        }
        if (!guild) {
            await SlashCommandUtil.deleteAllSlashCommands(client, false);
        }
    }
}