import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

const Post = sequelize.define(
  "UsPosters",
  {
    post_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "Posts",
  }
);

export default Post;
