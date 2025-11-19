const { validationResult } = require("express-validator");
const { CargoHold } = require("../db/models");
const sequelize = require("sequelize");
const { ApiError } = require("../Helper/Error.js");
const { v4: uuidv4 } = require("uuid");
const { decodeToken } = require("../utils/index.js");
const moment = require("moment");
const sequelizeConnection = require("../config/database-connection.js");

const pagedSearcCargoHold = async (req, res) => {
  const errros = validationResult(req);
  const { transhipmentUuid } = req.params;
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
    const whereCondition = {
      ...(keyword && {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("descriptions")),
            {
              [Op.like]: `%${keyword.toLowerCase()}%`,
            }
          ),
        ],
      }),
      ...(transhipmentUuid && { transhipmentUuid: transhipmentUuid }),
    };

    const result = await CargoHold.findAll({
      where: whereCondition,
      order: order,
    });

    res.json({
      data: result,
      totalCount: result.count,
      pageIndex: parseInt(pageIndex),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const createNewCargoHold = async (req, res) => {
  const errros = validationResult(req);
  const request = req.body;
  request.uuid = uuidv4();

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  const transaction = await sequelizeConnection.transaction();

  try {
    await CargoHold.create(
      {
        ...request,
        createdBy: decodeToken(req, "uuid"),
        createdDateTime: moment(new Date().toUTCString()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      id: request.code,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const updateCargoHold = async (req, res) => {
  const { uuid } = req.params;
  const request = req.body;
  const errros = validationResult(req);

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  try {
    await CargoHold.update(
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

const deleteCargoHold = async (req, res) => {
  const { uuid } = req.params;

  try {
    await CargoHold.destroy({
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

const readCargoHold = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await CargoHold.findOne({
      where: {
        uuid: uuid,
      },
      raw: true,
    });

    res.json({
      ...result,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

module.exports = {
  pagedSearcCargoHold,
  createNewCargoHold,
  updateCargoHold,
  deleteCargoHold,
  readCargoHold,
};
