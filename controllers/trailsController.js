exports.getTrails = (req, res) => {
  const trails = [
    {
      name: "George Wyth",
      city: "Cedar Falls",
      length: 7,
      description: "Stuff about trail",
    },
    {
      name: "Black Hawk",
      city: "Cedar Falls",
      length: 4,
      description: "Stuff about trail",
    },
  ];

  res.json(trails);
};
