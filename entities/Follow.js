import { DataTypes } from "sequelize";
import sequelize from "@/utils/sequelize";

const Follow = sequelize.define(
  "Follow",
  {
    follow_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'utilisateur qui suit",
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'utilisateur qui est suivi",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "Follows",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["follower_id", "following_id"],
        name: "unique_follow_relationship",
      },
      {
        fields: ["follower_id"],
        name: "idx_follower",
      },
      {
        fields: ["following_id"],
        name: "idx_following",
      },
    ],
  }
);

export default Follow;
