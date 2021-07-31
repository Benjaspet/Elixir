const client = require("../Elixir");

client.on("ready", () => {

    console.log(`✔ ${client.user.tag} logged in.`);
    client.user.setActivity({type: "LISTENING", name: "to your songs!"});

    // client.dev.registerElixirDevSlashCommands().then(response => console.log("Development slash commands deployed."));

});