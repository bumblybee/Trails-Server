const Edit = require("../db").Edit;
const { Op } = require("sequelize");

exports.getSuggestedEdits = async (req, res) => {
  const { trailId } = req.params;
  const edits = await Edit.findAll({
    where: {
      [Op.and]: [{ trailId, closed: false }],
    },
    attributes: [
      "id",
      "name",
      "city",
      "state",
      "description",
      "length",
      "difficulty",
      "hiking",
      "biking",
    ],
  });

  res.status(200).json(edits);
};
