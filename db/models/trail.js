"use strict";

//TODO: Double check lat and lng validation
//TODO: Figure out how to handle images

module.exports = (sequelize, DataTypes) => {
  const Trail = sequelize.define(
    "trail",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: -90, max: 90 },
      },
      lng: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: -180, max: 180 },
      },
      hiking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      biking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        name: {
          type: DataTypes.STRING,
        },
        data: {
          type: DataTypes.BLOB("long"),
        },
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 5 },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      directions: {
        type: DataTypes.STRING,
        allowNull: true,
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
