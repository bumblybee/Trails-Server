"use strict";

module.exports = (sequelize, DataTypes) => {
  const Edit = sequelize.define(
    "edit",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "name",
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "city",
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "state",
      },
      lnglat: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: false,
      },
      hiking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "hiking",
      },
      biking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "biking",
      },
      image: {
        type: DataTypes.STRING,
        field: "image",
      },
      difficulty: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "difficulty",
      },
      length: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: "length",
      },
      rating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "rating",
        validate: { min: 0, max: 5 },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
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
        default: false,
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
