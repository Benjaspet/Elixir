import SlashCommandUtil from "../utils/SlashCommandUtil";
import * as Discord from "discord.js";

export default class SlashCommandManager {

    protected client: Discord.Client;

    constructor(client: Discord.Client) {
        this.client = client;
    }

    public async updateAllSlashCommands(client, guild = true): Promise<void> {
        if (guild) {
            await SlashCommandUtil.setAllSlashCommands(client, true);
        }
        if (!guild) {
            await SlashCommandUtil.setAllSlashCommands(client, false);
        }
    }

    public async deleteAllSlashCommands(client, guild = true) {
        if (guild) {
            await SlashCommandUtil.deleteAllSlashCommands(client, true);
        }
        if (!guild) {
            await SlashCommandUtil.deleteAllSlashCommands(client, false);
        }
    }
}