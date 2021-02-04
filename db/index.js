"use strict";
//TODO: Add relationships
const Sequelize = require("sequelize");
const UserModel = require("./models/user.js");
const TrailModel = require("./models/trail");
const BookmarkModel = require("./models/bookmark");

const env = process.env.NODE_ENV || "development";

let sequelize;

if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false, pool: { max: 30000 } }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL);
}

// Link models to db
const User = UserModel(sequelize, Sequelize);
const Trail = TrailModel(sequelize, Sequelize);
const Bookmark = BookmarkModel(sequelize, Sequelize);

// Relationships
User.hasMany(Trail);
Trail.belongsTo(User);
Bookmark.belongsTo(User);
Bookmark.hasOne(Trail);

// authenticate db and log connection or error
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error:" + err));

module.exports = {
  sequelize,
  Sequelize,
  User,
  Trail,
  Bookmark,
};
