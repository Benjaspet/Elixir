// JSON data for all slash commands.
// Globally callable through client.slash.

function getAllElixirSlashData() {

    return [

        {
            name: "help",
            description: "Shows a list of all available commands."
        }

    ]

}

module.exports = {
    getAllElixirSlashData
}