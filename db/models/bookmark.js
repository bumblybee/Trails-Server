"use strict";

module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    "bookmark",
    {
      timestamps: true,
      paranoid: true,
    },
    { tableName: "bookmarks" }
  );
  return Bookmark;
};
