import {config} from "dotenv";

config();

export default class Config {

    public static get(value: string): any {
        return process.env[value];
    }
}