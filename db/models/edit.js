"use strict";

module.exports = (sequelize, DataTypes) => {
  const Edit = sequelize.define(
    "edit",
    {
      name: {
        type: DataTypes.STRING,
        field: "name",
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING,
        field: "city",
        defaultValue: null,
      },
      state: {
        type: DataTypes.STRING,
        field: "state",
        defaultValue: null,
      },
      lnglat: {
        type: DataTypes.GEOMETRY("POINT"),
        defaultValue: null,
      },
      hiking: {
        type: DataTypes.BOOLEAN,
        field: "hiking",
        defaultValue: false,
      },
      biking: {
        type: DataTypes.BOOLEAN,
        field: "biking",
        defaultValue: false,
      },
      difficulty: {
        type: DataTypes.STRING,
        field: "difficulty",
        defaultValue: null,
      },
      length: {
        type: DataTypes.DECIMAL,
        field: "length",
        defaultValue: null,
      },
      description: {
        type: DataTypes.TEXT,
        field: "description",
        defaultValue: null,
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
      closedBy: {
        type: DataTypes.UUID,
        field: "closed_by",
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
