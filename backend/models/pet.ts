import { sequelize } from "./connection";
import { DataTypes } from "sequelize";

export const Pet = sequelize.define(
    "Pet",
    {
        name: DataTypes.STRING,
        state: DataTypes.STRING,
        urlImage: DataTypes.STRING,
        location: DataTypes.STRING,
        lat: DataTypes.FLOAT,
        lng: DataTypes.FLOAT,
        UserId: DataTypes.INTEGER,
    },
    {
        modelName: "Pet",
    }
);
