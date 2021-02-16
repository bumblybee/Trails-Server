const Bookmark = require("../db").Bookmark;
const Trail = require("../db").Trail;
const { Op } = require("sequelize");

const { CustomError } = require("../handlers/errorHandlers");

exports.getBookmarks = async (req, res) => {
  const { id } = req.token.data;
  const bookmarks = await Bookmark.findAll({
    where: { userId: id },
    include: [
      {
        model: Trail,
      },
    ],
  });

  res.status(200).json(bookmarks);
};

exports.createBookmark = async (req, res) => {
  const { userId, trailId } = req.params;

  const bookmark = { userId, trailId };
  const createdBookmark = await Bookmark.create(bookmark);

  const bookmarks = await Bookmark.findAll({ where: { userId } });

  res.status(201).json({ code: "data.created", createdBookmark, bookmarks });
};

exports.removeBookmark = async (req, res) => {
  const { userId, trailId } = req.params;

  const destroyedBookmark = await Bookmark.destroy({
    where: { [Op.and]: [{ userId }, { trailId }] },
    returning: true,
    plain: true,
  });
  const bookmarks = await Bookmark.findAll({ where: { userId } });

  if (destroyedBookmark) {
    res
      .status(200)
      .json({ code: "data.destroyed", destroyedBookmark, bookmarks });
  } else {
    res
      .status(200)
      .json({ code: "data.nonexistent", destroyedBookmark, bookmarks });
  }
};
