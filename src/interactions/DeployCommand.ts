import DeployUtil from "../slash/DeployUtil";
import config from "../resources/Config";
import DatabaseUtil from "../utils/DatabaseUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "deploy") {
            DatabaseUtil.addExecutedCommand(1);
            const query = interaction.options.getString("variant");
            if (interaction.user.id !== config.developer.owner) {
                return await interaction.reply({content: "You must be a bot developer to run this command."});
            }
            if (query === "deploy-guild") {
                await DeployUtil.deployAllSlashCommands(client, false);
                await interaction.reply({content: "Slash commands successfully deployed to the development guild."});
            }
            if (query === "deploy-global") {
                await DeployUtil.deployAllSlashCommands(client, true);
                await interaction.reply({content: "Slash commands successfully deployed globally."});
            }
        }
    }
}