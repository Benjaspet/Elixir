import {Client} from "discord.js";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import Util from "../utils/Util";
import Config from "../Config";
import Logger from "../Logger";

export default class BaseCommand {

    private readonly client: Client;
    public slashData: object[];
    public action: any = {
        deploy: true,
        delete: false,
        guild: true
    };
    private clientId: any = Config.get("CLIENT-ID");
    private guildId: any = Config.get("GUILD-ID");

    constructor(client: Client, slashData: object[], action: object) {
        this.slashData = slashData;
        this.action = action;
        this.init().then(() => {});
    }

    private async init(): Promise<void> {
        const rest = new REST({version: "9"}).setToken(Config.get("TOKEN"));
        if (this.action.deploy) {
            if (this.action.guild) {
                try {
                    Logger.info("Refreshing all guild slash commands..");
                    await rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
                        body: SlashCommandUtil.getAllSlashCommandData(this.client)});
                    await Util.sleep(1000);
                    Logger.info("Successfully updated all guild slash commands.");
                } catch (error) {
                    Logger.error(error);
                }
            } else {
                try {
                    Logger.info("Refreshing all global slash commands..");
                    await rest.put(Routes.applicationCommands(this.clientId), {
                        body: SlashCommandUtil.getAllSlashCommandData(this.client)
                    });
                    await Util.sleep(1000);
                    Logger.info("Successfully updated all global slash commands.");
                } catch (error) {
                    Logger.error(error);
                }
            }
        } else if (this.action.delete && !this.action.deploy) {
            if (this.action.guild) {
                try {
                    Logger.info("Deleting all guild slash commands...");
                    await rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
                        body: []});
                    Logger.info("Successfully deleted all guild slash commands.");
                } catch (error) {
                    Logger.error(error);
                }
            } else {
                try {
                    Logger.info("Deleting all global slash commands...");
                    await rest.put(Routes.applicationCommands(this.clientId), {
                        body: []});
                    Logger.info("Successfully deleted all global slash commands.");
                } catch (error) {
                    Logger.error(error);
                }
            }
        }
    }
}