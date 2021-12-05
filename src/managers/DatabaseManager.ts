import Logger from "../Logger";
import * as mongoose from "mongoose";
import Config from "../Config";

export default class DatabaseManager {

    public static async connect(): Promise<void> {
        await mongoose.connect(Config.get("MONGO-URI"));
        Logger.info("Connected to database.");
    }
}