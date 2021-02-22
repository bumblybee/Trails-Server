const User = require("../db").User;

exports.authRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { id: userId } = req.token.data;
      const userRecord = await User.findOne({ where: { id: userId } });

      const { role } = userRecord;

      if (!userRecord) {
        return res.status(404).json({ error: "user.notFound" });
      } else if (!!requiredRoles && !isCorrectRole(requiredRoles, role)) {
        return res.status(403).json({ error: "auth.invalidCredentials" });
      } else {
        return next();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const isCorrectRole = (requiredRoles, userRole) => {
  if (typeof requiredRoles === "string") {
    return userRole === requiredRoles;
  } else {
    return requiredRoles.includes(userRole);
  }
};
