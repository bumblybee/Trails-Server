"use strict";

//TODO: Double check lat and lng validation
//TODO: Figure out how to handle images - need to match url structure of data coming from external api

module.exports = (sequelize, DataTypes) => {
  const Trail = sequelize.define(
    "trail",
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
      directions: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "directions",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
    { tableName: "trails" }
  );
  return Trail;
};
