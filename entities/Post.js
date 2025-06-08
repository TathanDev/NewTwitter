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
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    likes: {
      type: DataTypes.JSON,
      defaultValue: 0,
      allowNull: false,
    },
    share_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    comments: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
  },
  {
    tableName: "Posts",
  }
);

export default Post;
