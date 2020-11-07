"use strict";
//TODO: Add relationships
const Sequelize = require("sequelize");
const UserModel = require("./models/user.js");
const TrailModel = require("./models/trail");

const env = process.env.NODE_ENV || "development";

let sequelize;

if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL);
}

// Link models to db
const User = UserModel(sequelize, Sequelize);
const Trail = TrailModel(sequelize, Sequelize);

// authenticate db
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error:" + err));

module.exports = {
  sequelize,
  Sequelize,
  User,
  Trail,
};
