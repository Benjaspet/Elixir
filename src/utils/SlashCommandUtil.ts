import config from "../resources/Config";
import {Client} from "discord.js";
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
import ElixirUtil from "./ElixirUtil";
import InfoCommand from "../commands/InfoCommand";
import FilterCommand from "../commands/FilterCommand";
import HelpCommand from "../commands/HelpCommand";
import JoinCommand from "../commands/JoinCommand";
import NowPlayingCommand from "../commands/NowPlayingCommand";
import PauseCommand from "../commands/PauseCommand";
import QueueCommand from "../commands/QueueCommand";
import ResumeCommand from "../commands/ResumeCommand";
import ShuffleCommand from "../commands/ShuffleCommand";
import SkipCommand from "../commands/SkipCommand";
import StopCommand from "../commands/StopCommand";
import VolumeCommand from "../commands/VolumeCommand";
import PlayCommand from "../commands/PlayCommand";

export default class SlashCommandUtil {

    public static async setAllSlashCommands(client: Client, guild = true) {
        const rest = new REST({version: 9}).setToken(config.token);
        if (guild) {
            try {
                console.log("◒ Refreshing all guild slash commands...");
                await rest.put(Routes.applicationGuildCommands(config.clientId, config.guild), {
                    body: SlashCommandUtil.getAllSlashCommandData(client)});
                await ElixirUtil.sleep(1000);
                console.log("✔ Successfully updated all guild slash commands.");
            } catch (error) {
                console.error(error);
            }
        } else {
            if (!guild) {
                try {
                    console.log("◒ Refreshing all global slash commands...");
                    await rest.put(Routes.applicationCommands(config.clientId), {
                        body: SlashCommandUtil.getAllSlashCommandData(client)});
                    await ElixirUtil.sleep(1000);
                    console.log("✔ Successfully updated all global slash commands.");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    public static async deleteAllSlashCommands(client: Client, guild: boolean = true) {
        const rest = new REST({version: 9}).setToken(config.token);
        if (guild) {
            try {
                console.log("◒ Deleting all guild slash commands...");
                await rest.put(Routes.applicationGuildCommands(config.clientId, config.guild), {
                    body: []});
                console.log("✔ Successfully deleted all guild slash commands.");
            } catch (error) {
                console.error(error);
            }
        } else {
            if (!guild) {
                try {
                    console.log("◒ Deleting all global slash commands...");
                    await rest.put(Routes.applicationCommands(config.clientId), {
                        body: []});
                    console.log("✔ Successfully deleted all global slash commands.");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    public static slashCommandTypeToInt(type: string): number {
        const types = {
            "SUB_COMMAND": 1,
            "SUB_COMMAND_GROUP": 2,
            "STRING": 3,
            "INTEGER": 4,
            "BOOLEAN": 5,
            "USER": 6,
            "CHANNEL": 7,
            "ROLE": 8,
            "MENTIONABLE": 9,
            "NUMBER": 10
        }
        return types[type];
    }

    public static getAllSlashCommandData(client: Client): object[] {
        return [
            new InfoCommand(client).getSlashData(),
            new FilterCommand(client).getSlashData(),
            new HelpCommand(client).getSlashData(),
            new JoinCommand(client).getSlashData(),
            new NowPlayingCommand(client).getSlashData(),
            new PauseCommand(client).getSlashData(),
            new QueueCommand(client).getSlashData(),
            new ResumeCommand(client).getSlashData(),
            new ShuffleCommand(client).getSlashData(),
            new SkipCommand(client).getSlashData(),
            new StopCommand(client).getSlashData(),
            new VolumeCommand(client).getSlashData(),
            new PlayCommand(client).getSlashData()
        ]
    }

}