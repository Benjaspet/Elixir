import DatabaseUtil from "../utils/DatabaseUtil";
import SqLite3 from "../resources/SqLite3";
import ElixirUtil from "../utils/ElixirUtil";

export default class DatabaseManager {

    constructor() {
        this.createAllTables().then(() => {});
    }

    private async createAllTables(): Promise<void> {
        SqLite3.master.exec(DatabaseUtil.getSqlQuery(0));
        await ElixirUtil.sleep(2000);
        console.log("✔ Database loaded.")
    }
}