import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

const User = sequelize.define(
  "Users",
  {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pseudo_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mail_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description_user: {
      type: DataTypes.STRING(255),
      defaultValue: "Lorem Ipsum 😎",
    },
    pfp_user: {
      type: DataTypes.STRING(255),
      defaultValue:
        "http://scriptum.odysseyus.fr/elements/img/user-icon-dark.png",
    },
  },
  {
    tableName: "Users",
  }
);

export default User;
