"use strict";
// TODO: add trail drafts

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "username",
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          const normalizedEmail = value.trim().toLowerCase();
          this.setDataValue("email", normalizedEmail);
        },
        validate: {
          isEmail: {
            msg: "signup.invalidEmail",
          },
        },
        field: "email",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password",
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        field: "reset_password_token",
      },
      resetPasswordExpiry: {
        type: DataTypes.DATE,
        field: "reset_password_expiry",
      },
      role: {
        type: DataTypes.STRING,
        field: "role",
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
    },
    {
      timestamps: true,
      paranoid: true,
    },
    { tableName: "user" }
  );
  return User;
};
