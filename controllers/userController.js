const authService = require("../services/authService");
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
