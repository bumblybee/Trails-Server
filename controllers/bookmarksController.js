const Bookmark = require("../db").Bookmark;
const { Op } = require("sequelize");

const { CustomError } = require("../handlers/errorHandlers");

exports.createBookmark = async (req, res) => {
  const { id: userId } = req.token.data;
  const { id: trailId } = req.params;
  const bookmark = { userId, trailId };

  const existentBookmark = await Bookmark.findOne({
    where: { trailId, userId },
  });

  if (!existentBookmark) {
    const createdBookmark = await Bookmark.create(bookmark);

    res.status(201).json({ code: "data.created", createdBookmark });
  } else {
    res.status(200).json({ code: "data.existent", existentBookmark });
  }
};

exports.removeBookmark = async (req, res) => {
  const { id: userId } = req.token.data;
  const { id: trailId } = req.params;

  const destroyedBookmark = await Bookmark.destroy({
    where: { [Op.and]: [{ userId }, { trailId }] },
    returning: true,
    plain: true,
  });
  if (destroyedBookmark) {
    res.status(200).json({ code: "data.destroyed", destroyedBookmark });
  } else {
    res.status(200).json({ code: "data.nonexistent", destroyedBookmark });
  }
};
