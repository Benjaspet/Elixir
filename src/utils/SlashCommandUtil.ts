import config from "../resources/Config";
import {Client} from "discord.js";
import ElixirUtil from "./ElixirUtil";
import Elixir from "../Elixir";
import InfoCommand from "../commands/InfoCommand";
import FilterCommand from "../commands/FilterCommand";
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

export default class SlashCommandUtil {

    public static async setAllSlashCommands(client, guild = true) {
        const rest = new REST({version: 9}).setToken(config.token);
        if (guild) {
            try {
                console.log("◒ Refreshing all guild slash commands...");
                await rest.put(Routes.applicationGuildCommands(config.clientId, config.developer.developerGuild), {
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
                    await rest.put(Routes.applicationGuildCommands(config.clientId), {
                        body: SlashCommandUtil.getAllSlashCommandData(client)});
                    await ElixirUtil.sleep(1000);
                    console.log("✔ Successfully updated all global slash commands.");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    public static async deleteAllSlashCommands(client, guild: boolean = true) {
        const rest = new REST({version: 9}).setToken(config.token);
        if (guild) {
            try {
                console.log("◒ Deleting all guild slash commands...");
                await rest.put(Routes.applicationGuildCommands(config.clientId, config.developer.testGuild), {
                    body: []});
                await ElixirUtil.sleep(1000);
                console.log("✔ Successfully deleted all guild slash commands.");
            } catch (error) {
                console.error(error);
            }
        } else {
            if (!guild) {
                try {
                    console.log("◒ Deleting all global slash commands...");
                    await rest.put(Routes.applicationGuildCommands(config.clientId), {
                        body: []});
                    await ElixirUtil.sleep(1000);
                    console.log("✔ Successfully deleted all global slash commands.");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    public static getAllSlashCommandData(client: Client): object[] {
        return [
            new InfoCommand(client).getSlashData(),
            new FilterCommand(client).getSlashData()
        ]
    }

}