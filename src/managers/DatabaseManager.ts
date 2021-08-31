import {Client} from "discord.js";
import DatabaseUtil from "../utils/DatabaseUtil";
import SqLite3 from "../resources/SqLite3";

export default class DatabaseManager {

    public static createAllTables(): void {
        SqLite3.master.exec(DatabaseUtil.getSqlQuery(0));
        console.log("Database loaded.")
    }

}