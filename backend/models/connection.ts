import { Sequelize } from "sequelize";

const USERNAME = process.env.SEQUELIZE_USERNAME;
const PASSWORD = process.env.SEQUELIZE_PASSWORD;
const DATABASE = process.env.SEQUELIZE_DATABASE;
const HOST = process.env.SEQUELIZE_HOST;
export const sequelize = new Sequelize({
    dialect: "postgres",
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    port: 5432,
    host: HOST,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
