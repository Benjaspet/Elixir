const client = require("../Elixir");

client.on("ready", () => {

    console.log(`✔ ${client.user.tag} logged in.`);
    client.user.setActivity({type: "LISTENING", name: "to your songs!"});

    if (client.config.developer["ponjo-test-guild"]) {




    }

});