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
    // Nouveaux champs optionnels pour les paramètres utilisateur
    email_settings: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "Users",
  }
);

export default User;
