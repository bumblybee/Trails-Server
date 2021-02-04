const Bookmark = require("../db").Bookmark;
const { CustomError } = require("../handlers/errorHandlers");

exports.createBookmark = async (req, res) => {
  const { id: userId } = req.token.data;
  const { id: trailId } = req.params;
  const bookmark = { userId, trailId };

  const existingBookmark = await Bookmark.findOne({
    where: { trailId, userId },
  });

  if (!existingBookmark) {
    const createdBookmark = await Bookmark.create(bookmark);

    res.status(201).json({ code: "data.created", createdBookmark });
  } else {
    res.status(200).json({ code: "data.unchanged", Bookmark });
  }
};
