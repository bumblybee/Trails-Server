const Bookmark = require("../db").Bookmark;
const { Op } = require("sequelize");

const { CustomError } = require("../handlers/errorHandlers");

exports.getBookmarks = async (req, res) => {
  const { id: userId } = req.token.data;
  const bookmarks = await Bookmark.find({ where: { userId } });

  res.status(200).json({ code: "data.located", bookmarks });
};

exports.createBookmark = async (req, res) => {
  const { id: userId } = req.token.data;
  const { id: trailId } = req.params;

  const existentBookmark = await Bookmark.findOne({
    where: { [Op.and]: [{ userId }, { trailId }] },
  });

  if (!existentBookmark) {
    const bookmark = { userId, trailId };
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
