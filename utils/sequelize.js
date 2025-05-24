
import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3";

const sequelize = new Sequelize("bdd", process.env.DB_USER, process.env.DB_PASSWORD, {


    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: "./db.sqlite",
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false
    }

})


const initDB = async () => {

    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: false});
    } catch (error) {

        console.error(error)
    }
}

initDB();

export default sequelize;