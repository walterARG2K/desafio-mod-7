import { sequelize } from "./connection";
import { DataTypes } from "sequelize";

export const Auth = sequelize.define(
    "Auth",
    {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
    },
    {
        modelName: "Auth",
    }
);
