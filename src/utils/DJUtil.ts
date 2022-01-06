import {Snowflake} from "discord.js";
import DJRole from "../schemas/DJSchema";

export default class DJUtil {

    public static async getDJRole(guild: Snowflake): Promise<any> {
        return void await new Promise(async(resolve, reject) => {
            try {
                const result = await DJRole.findOne({guildId: guild});
                resolve({
                    guild: result.guildId,
                    role: result.roleId
                });
            } catch (error: any) {
                reject({
                    msg: "An error ocurred while attempting to perform this action."
                });
            }
        });
    }

    public static async setDJRole(guild: Snowflake, role: Snowflake): Promise<any> {
        return await new Promise(async(resolve, reject) => {
            try {
                const result = await DJRole.findOneAndUpdate({guild: guild}, {roleId: role});
                resolve({
                    guild: result.guildId,
                    role: result.roleId
                });
            } catch (error: any) {
                reject({
                    msg: "An error ocurred while attempting to perform this action."
                });
            }
        });
    }

    public static async doesDJRoleExist(guild: Snowflake): Promise<boolean> {
        const result = await DJRole.findOne({guild: guild});
        return !!result;
    }
}