import { sequelize } from "./connection";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
    "User",
    {
        full_name: DataTypes.STRING,
        email: DataTypes.STRING,
    },
    {
        modelName: "User",
    }
);
