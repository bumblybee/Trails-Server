const Sequelize = require("sequelize");
const authService = require("../services/authService");
const User = require("../db").User;
const { CustomError } = require("../handlers/errorHandlers");

const COOKIE_CONFIG = require("../config/cookieConfig").COOKIE_CONFIG;

exports.getCurrentUser = async (req, res) => {
  const { id } = req.token.data;

  const user = await authService.getUser(id);
  res.json({ user });
};

exports.signupUser = async (req, res) => {
  const { email, username, password } = req.body;

  const { jwt, userData: user } = await authService.signupUser(
    email,
    username,
    password
  );

  if (user) {
    res.cookie("_ts", jwt, COOKIE_CONFIG);

    res.json(user);
  } else {
    //TODO: handle errors not picked up in authService
    throw new CustomError("auth.unknownIssue", "signupError", 500);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { jwt, userData: user } = await authService.loginUser(email, password);

  if (user) {
    res.cookie("_ts", jwt, COOKIE_CONFIG);
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } else {
    throw new CustomError("auth.invalidCredentials", "loginError", 401);
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("_ts", COOKIE_CONFIG).json({ message: "User logged out" });
};

exports.generatePasswordResetLink = async (req, res) => {
  const { email } = req.body;

  const { userRecord } = authService.generatePasswordReset(email);

  if (!userRecord) {
    // TODO: Add logging noting user doesn't exist
    console.log(userRecord);
  }
  res.json({ message: "An email has been sent to the address provided." });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const { userRecord } = await authService.passwordReset(token, password);

  if (!token || !userRecord) {
    throw new CustomError("auth.noToken", "PasswordResetError", 401);
  }

  res.json({
    message: "Password Updated",

    id: userRecord.id,
    email: userRecord.email,
    username: userRecord.username,
  });
};

exports.bookMarkTrail = async (req, res) => {
  // Ask Jay about getting id from token, or if should include in params
  const { id: userId } = req.token.data;
  const trailId = req.params.id;

  const updated = await User.update(
    {
      bookmarks: Sequelize.fn(
        "array_append",
        Sequelize.col("bookmarks"),
        trailId
      ),
    },
    {
      where: { id: userId },
      attributes: ["username", "bookmarks"],
      returning: true,
      plain: true,
    }
  );

  res.status(200).json(updated);
};
