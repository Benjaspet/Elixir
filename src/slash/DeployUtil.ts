import config from "../resources/Config";
import elixirSlashCommandData from "./SlashDataUtil";

export default class DeployUtil {

    public static deployAllSlashCommands(client, global = false): void {

        if (global === false) {

            client.guilds.cache.get(config.developer.developerGuild)?.commands.set(elixirSlashCommandData)
                .then(response => console.log("All slash commands have been deployed to the development guild."));


        } else if (global === true) {

            client.application?.commands.set(elixirSlashCommandData)
                .then(response => console.log("All slash commands have been globally deployed."));

        }
    }
}