"use strict";

module.exports = (sequelize, DataTypes) => {
  const Edit = sequelize.define(
    "edit",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        field: "name",
      },
      city: {
        type: DataTypes.STRING,
        field: "city",
      },
      state: {
        type: DataTypes.STRING,
        field: "state",
      },
      lnglat: {
        type: DataTypes.GEOMETRY("POINT"),
      },
      hiking: {
        type: DataTypes.BOOLEAN,
        field: "hiking",
      },
      biking: {
        type: DataTypes.BOOLEAN,
        field: "biking",
      },
      difficulty: {
        type: DataTypes.STRING,
        field: "difficulty",
      },
      length: {
        type: DataTypes.DECIMAL,
        field: "length",
      },
      description: {
        type: DataTypes.TEXT,
        field: "description",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
      closed: {
        type: DataTypes.BOOLEAN,
        field: "closed",
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
    { tableName: "edits" }
  );
  return Edit;
};
