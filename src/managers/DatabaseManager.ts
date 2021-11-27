import DatabaseUtil from "../utils/DatabaseUtil";
import SqLite3 from "../resources/SqLite3";
import ElixirUtil from "../utils/ElixirUtil";
import Logger from "../Logger";

export default class DatabaseManager {

    constructor() {
        this.createAllTables().then(() => {});
    }

    private async createAllTables(): Promise<void> {
        SqLite3.exec(DatabaseUtil.getSqlQuery(0));
        await ElixirUtil.sleep(2000);
        Logger.info("Database loaded.");
    }
}