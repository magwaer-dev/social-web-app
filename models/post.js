const sequelize = require("../util/database");
const User = require("../models/user");

const { DataTypes } = require("sequelize");

const Post = sequelize.define("Posts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
    unsigned: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING(280), // Adjust the length as needed
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // This should match the name of your User model
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

Post.belongsTo(User, { foreignKey: "userId" });


module.exports = Post;
