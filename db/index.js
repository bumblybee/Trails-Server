"use strict";
//TODO: Add relationships
const Sequelize = require("sequelize");
const UserModel = require("./models/user.js");
const TrailModel = require("./models/trail");
const BookmarkModel = require("./models/bookmark");
const EditModel = require("./models/edit");

const env = process.env.NODE_ENV || "development";

let sequelize;

// Environment config
if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

// Link models to db
const User = UserModel(sequelize, Sequelize);
const Trail = TrailModel(sequelize, Sequelize);
const Bookmark = BookmarkModel(sequelize, Sequelize);
const Edit = EditModel(sequelize, Sequelize);

// Relationships
User.hasMany(Trail);
User.hasMany(Bookmark);
User.hasMany(Edit);
Trail.belongsTo(User);
Trail.hasMany(Bookmark);
Trail.hasMany(Edit);
Bookmark.belongsTo(User);
Bookmark.belongsTo(Trail);
Edit.belongsTo(User);
Edit.belongsTo(Trail);

// Authenticate db and log connection/error
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
  Edit,
};
