const Trail = require("../db").Trail;
const Bookmark = require("../db").Bookmark;
const Edit = require("../db").Edit;
const emailHandler = require("../handlers/emailHandler");
const authService = require("../services/authService");
const { CustomError } = require("../handlers/errorHandlers");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

//TODO: Get trails by bookmark : include model Bookmark, find trails where bookmark.userId = userId
exports.getSingleTrail = async (req, res) => {
  const { id } = req.params;

  const trail = await Trail.findOne({ where: { id: id } });

  res.json(trail);
};

exports.getScoutedTrails = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const trails = await Trail.findAll({ where: { userId: id } });

  res.status(200).json(trails);
};

/* 
Pagination examples
-------------------------------
Fetch 10 instances/rows
Project.findAll({ limit: 10 });

Skip 8 instances/rows
Project.findAll({ offset: 8 });

Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 });
*/

exports.searchTrails = async (req, res) => {
  const { lng, lat } = req.query;

  const location = sequelize.literal(
    `ST_GeomFromText('POINT(${lng} ${lat})', 4326)`
  );

  //TODO: figure out fn for max distance
  const distance = sequelize.fn(
    "ST_DistanceSphere",
    sequelize.literal("lnglat"),
    location
  );

  const whereConfig = {};
  if (req.query.filter) {
    if (req.query.filter === "hiking") {
      whereConfig.hiking = true;
    } else if (req.query.filter === "biking") {
      whereConfig.biking = true;
    }
  }

  const trails = await Trail.findAll({
    where: whereConfig,
    attributes: {
      include: [[distance, "distance"]],
    },
    include: [{ model: Bookmark }],
    order: distance,
    limit: 20,
  });

  res.json(trails);
};

exports.createTrail = async (req, res) => {
  // throw new CustomError("upload.failed", "UploadError", 400);
  const { id: userId } = req.token.data;
  const {
    name,
    city,
    state,
    lat,
    lng,
    hiking,
    biking,
    length,
    rating,
    description,
    difficulty,
  } = req.body;

  if (!hiking) hiking = false;
  if (!biking) biking = false;

  const imageUrl = req.file ? req.file.location : null;

  const point = { type: "Point", coordinates: [lng, lat] };

  const newTrail = {
    userId,
    name,
    city,
    state,
    lnglat: point,
    hiking,
    biking,
    image: imageUrl,
    length,
    rating,
    description,
    difficulty,
  };

  const trail = await Trail.create(newTrail);

  res.status(201).json(trail);
};

exports.suggestTrailEdit = async (req, res) => {
  const { id: userId } = req.token.data;
  const {
    name,
    city,
    state,
    lat,
    lng,
    hiking,
    biking,
    length,
    rating,
    description,
    difficulty,
    trailId,
  } = req.body;

  const point = { type: "Point", coordinates: [lng, lat] };

  const suggestedEdit = {
    name,
    city,
    state,
    lnglat: point,
    hiking,
    biking,
    length,
    rating,
    description,
    difficulty,
    trailId,
    userId,
  };

  const createdSuggestion = await Edit.create(suggestedEdit);

  const uneditedTrail = await Trail.findOne({ where: { id: trailId } });

  const changes = {};
  const uneditedData = uneditedTrail.dataValues;

  for (const key in suggestedEdit) {
    if (suggestedEdit[key] !== uneditedData[key] && key !== "lnglat") {
      changes[key] = {
        original: uneditedData[key],
        edit: suggestedEdit[key],
      };
    }
  }

  const user = await authService.getUser(userId);
  // TODO: Include relevant data in admin email - maybe do send trailId and userId, but exclude if not admin... Two separate email sends
  emailHandler.sendEmail({
    subject: "We've Recieved your Suggestions",
    filename: "suggestedEditsUserEmail",
    user: {
      username: user.username,
      email: user.email,
    },
    changes,
  });

  emailHandler.sendEmail({
    subject: "New Edit Request",
    filename: "suggestedEditsAdminEmail",
    user: {
      username: user.username,
      email: process.env.ADMIN_EMAIL,
    },
    changes,
  });

  res.status(200).json(createdSuggestion);
};

exports.editTrail = async (req, res) => {
  const { id: userId } = req.token.data;
  const {
    name,
    city,
    state,
    lat,
    lng,
    hiking,
    biking,
    length,
    rating,
    description,
    difficulty,
    trailId,
  } = req.body;

  const point = { type: "Point", coordinates: [lng, lat] };

  const editDetails = {
    name,
    city,
    state,
    lnglat: point,
    hiking,
    biking,
    length,
    rating,
    description,
    difficulty,
    trailId,
    userId,
    closed: true,
    closedBy: userId,
  };

  const editedTrail = await Trail.update(
    { editDetails },
    {
      where: { id: trailId },
      returning: true,
      plain: true,
    }
  );

  res.status(201).json(editedTrail);
};
