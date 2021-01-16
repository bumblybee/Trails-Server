const authService = require("../services/authService");
const { CustomError } = require("../handlers/errorHandlers");
const COOKIE_CONFIG = require("../config/cookieConfig").COOKIE_CONFIG;

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
    res.json({ error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { jwt, userData: user } = await authService.loginUser(email, password);

  res.cookie("jwt", jwt, COOKIE_CONFIG);

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } else {
    throw new CustomError("auth.invalidCredentials", "loginError", 401);
  }
};
