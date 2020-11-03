exports.getUsers = (req, res) => {
  const users = [{ name: "john" }, { name: "jill" }];

  res.json(users);
};
