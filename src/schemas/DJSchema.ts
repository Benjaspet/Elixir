import {model, Model, Schema} from "mongoose";

const DJSchema: Schema = new Schema(
    {
        guildId: String,
        roleId: String
    },
    {
        timestamps: false,
        versionKey: false
    }
);

const DJRole: Model<any> = model("djroles", DJSchema);
export default DJRole;