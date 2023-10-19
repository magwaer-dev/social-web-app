const sequelize = require("../util/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
    unsigned: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  resetToken: {
    type: DataTypes.STRING,
  },
  resetTokenExpiration: {
    type: DataTypes.DATE,
  },
});

module.exports = User;
