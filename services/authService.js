const User = require("../db").User;
const Bookmark = require("../db").Bookmark;
const Trail = require("../db").Trail;
const roles = require("../enums/roles");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const crypto = require("crypto");
const emailHandler = require("../handlers/emailHandler");
const { RESET_PASSWORD_URL } = require("../config/passwordResetConfig");
const { CustomError } = require("../handlers/errorHandlers");
const { Op } = require("sequelize");

exports.generateJWT = (user) => {
  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const secret = Buffer.from(process.env.JWT_SECRET, "base64");
  const expiration = "4h";

  return jwt.sign({ data }, secret, {
    expiresIn: expiration,
  });
};

exports.getUser = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: ["id", "username", "email"],
    include: [{ model: Bookmark }, { model: Trail }],
  });

  if (user) {
    return user;
  } else {
    return { user: null };
  }
};

exports.createAdminUser = async (username, email, password) => {
  const hash = await argon2.hash(password);

  const newAdmin = {
    username,
    email,
    password: hash,
    role: roles.Admin,
  };

  const adminUser = await User.create(newAdmin);

  const createdAdminUser = {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
  };

  emailHandler.sendEmail({
    subject: "Welcome to TrailScout!",
    filename: "welcomeEmail",
    user: {
      username,
      email,
    },
  });

  return createdAdminUser;
};

exports.signupUser = async (email, username, password) => {
  const existingCredentials = await User.findOne({
    where: { [Op.or]: [{ email: email }, { username: username }] },
  });

  if (existingCredentials) {
    throw new CustomError("auth.existingCredentials", "SignupError", 401);
  } else {
    const hash = await argon2.hash(password);

    const newUser = {
      username,
      email,
      password: hash,
      role: roles.User,
    };

    // Store user in db
    const createdUser = await User.create(newUser);

    if (createdUser) {
      // Send welcome email
      emailHandler.sendEmail({
        subject: "Welcome to TrailScout!",
        filename: "welcomeEmail",
        user: {
          username,
          email,
        },
      });

      const jwt = this.generateJWT(createdUser);

      const userData = {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      };

      return { jwt, userData };
    } else {
      throw new CustomError("auth.failedSignup", "SignupError", 401);
    }
  }
};

exports.loginUser = async (email, password) => {
  const userRecord = await User.findOne({ where: { email: email } });

  if (!userRecord) {
    // Handle login failure
    throw new CustomError("auth.invalidCredentials", "LoginError", 403);
  } else {
    const correctPassword = await argon2.verify(userRecord.password, password);

    // Handle incorrect password
    if (!correctPassword) {
      throw new CustomError("auth.invalidCredentials", "LoginError", 401);
    }

    const jwt = this.generateJWT(userRecord);

    const userData = {
      id: userRecord.id,
      username: userRecord.username,
      email: userRecord.email,
      bookmarks: userRecord.bookmarks,
    };

    return {
      jwt,
      userData,
    };
  }
};

exports.generatePasswordReset = async (email) => {
  const userRecord = await User.findOne({ where: { email: email } });

  const resetToken = crypto.randomBytes(25).toString("hex");
  const resetExpiry = Date.now() + 1000 * 60 * 60;

  if (userRecord) {
    await User.update(
      { resetPasswordToken: resetToken, resetPasswordExpiry: resetExpiry },
      { where: { email } }
    );

    const resetPasswordUrl = `${RESET_PASSWORD_URL}/${resetToken}`;

    emailHandler.sendEmail({
      subject: "Reset your TrailScout Password",
      filename: "resetPasswordEmail",
      user: { email },

      resetPasswordUrl,
    });
  }

  return { userRecord };
};

exports.passwordReset = async (token, password) => {
  const userRecord = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: { [Op.gt]: Date.now() },
    },
  });

  if (userRecord) {
    const hashedPassword = await argon2.hash(password);

    await userRecord.update({ password: hashedPassword });
  }

  return { userRecord };
};
