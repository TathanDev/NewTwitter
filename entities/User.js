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
      comment:
        "Email principal utilisé pour la connexion et l'authentification",
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
      defaultValue: "",
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Champ pour stocker les IDs des posts favoris
    favorite_posts: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("favorite_posts");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("favorite_posts", JSON.stringify(value || []));
      },
    },
  },
  {
    tableName: "Users",
  }
);

export default User;
