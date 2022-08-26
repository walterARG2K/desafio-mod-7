import { sequelize } from "./connection";
import { DataTypes } from "sequelize";

export const Report = sequelize.define(
    "Report",
    {
        reporter: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        description: DataTypes.STRING(1000),
        pet_id: DataTypes.INTEGER,
    },
    {
        modelName: "Report",
    }
);
