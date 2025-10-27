const { validationResult } = require("express-validator");
const { TugBoat } = require("../db/models");
const sequelize = require("sequelize");
const { ApiError } = require("../Helper/Error.js");
const { v4: uuidv4 } = require("uuid");
const { decodeToken } = require("../utils/index.js");
const moment = require("moment");

const pagedSearcTugBoat = async (req, res) => {
  const errros = validationResult(req);
  const { pageIndex, pageSize, keyword, orderByFieldName, sortOrder } =
    req.query;

  let order = [];
  if (orderByFieldName) {
    const direction =
      sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[orderByFieldName, direction]];
  }

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  const Op = sequelize.Op;

  try {
    const whereCondition = keyword
      ? {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${keyword}%`,
              },
            },
          ],
        }
      : {};

    const result = await TugBoat.findAndCountAll({
      where: whereCondition,
      limit: parseInt(pageSize),
      offset: parseInt(pageSize * pageIndex),
      order: order,
    });

    res.json({
      data: result.rows,
      totalCount: result.count,
      pageIndex: parseInt(pageIndex),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const createNewTugBoat = async (req, res) => {
  const errros = validationResult(req);
  const request = req.body;
  request.uuid = uuidv4();

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  try {
    await TugBoat.create({
      ...request,
      createdBy: decodeToken(req, "uuid"),
      createdDateTime: moment(new Date().toUTCString()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });
    res.status(201).json({
      id: request.code,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const updateTugBoat = async (req, res) => {
  const { uuid } = req.params;
  const request = req.body;
  const errros = validationResult(req);

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  try {
    await TugBoat.update(
      {
        ...request,
        lastModifiedBy: decodeToken(req, "uuid"),
        lastModifiedDateTime: moment(new Date().toUTCString()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      },
      {
        where: {
          uuid,
        },
      }
    );

    res.json({
      id: uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const deleteTugBoat = async (req, res) => {
  const { uuid } = req.params;

  try {
    await TugBoat.destroy({
      where: {
        uuid,
      },
    });
    res.json({
      uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const readTugBoat = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await TugBoat.findOne({
      where: {
        uuid: uuid,
      },
    });

    res.json({
      ...result.dataValues,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

module.exports = {
  pagedSearcTugBoat,
  createNewTugBoat,
  updateTugBoat,
  deleteTugBoat,
  readTugBoat,
};
