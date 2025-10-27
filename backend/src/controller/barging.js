const { validationResult } = require("express-validator");
const { Barging, BargingDetail, VwBargingDetail } = require("../db/models");
const sequelize = require("sequelize");
const { ApiError } = require("../Helper/Error.js");
const { v4: uuidv4 } = require("uuid");
const { decodeToken } = require("../utils/index.js");
const moment = require("moment");
const sequelizeConnection = require("../config/database-connection.js");

const pagedSearcBarging = async (req, res) => {
  const errros = validationResult(req);
  const { pageIndex, pageSize, keyword, orderByFieldName, sortOrder, company } =
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
        [Op.or]: [{ mv: { [Op.like]: `%${keyword}%` } }],
      }),
      ...(company && { company: company }),
    };

    const result = await Barging.findAndCountAll({
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

const createNewBarging = async (req, res) => {
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
    await Barging.create(
      {
        ...request,
        createdBy: decodeToken(req, "uuid"),
        createdDateTime: moment(new Date().toUTCString()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      },
      { transaction }
    );

    if (Array.isArray(request.detail) && request.detail.length > 0) {
      const details = request.detail.map((item) => ({
        ...item,
        uuid: uuidv4(),
        bargingUuid: request.uuid,
        createdBy: decodeToken(req, "uuid"),
        createdDateTime: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      }));

      await BargingDetail.bulkCreate(details, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      id: request.code,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const updateBarging = async (req, res) => {
  const { uuid } = req.params;
  const request = req.body;
  const errros = validationResult(req);

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  const transaction = await sequelizeConnection.transaction();

  try {
    await Barging.update(
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
        transaction,
      }
    );

    await BargingDetail.destroy({
      where: { bargingUuid: uuid },
      transaction,
    });

    const details = request.detail.map((item) => ({
      ...item,
      uuid: uuidv4(),
      bargingUuid: uuid,
      createdBy: decodeToken(req, "uuid"),
      createdDateTime: moment(new Date().toUTCString()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    }));

    if (details.length > 0) {
      await BargingDetail.bulkCreate(details, { transaction });
    }

    await transaction.commit();

    res.json({
      id: uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const deleteBarging = async (req, res) => {
  const { uuid } = req.params;

  const transaction = await sequelizeConnection.transaction();

  try {
    await BargingDetail.destroy({
      where: { bargingUuid: uuid },
      transaction,
    });

    await Barging.destroy({
      where: {
        uuid,
      },
      transaction,
    });
    await transaction.commit();
    res.json({
      uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const readBarging = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await Barging.findOne({
      where: {
        uuid: uuid,
      },
    });

    const detail = await VwBargingDetail.findAll({
      where: {
        bargingUuid: uuid,
      },
      raw: true,
    });

    res.json({
      ...result.dataValues,
      detail: detail,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

module.exports = {
  pagedSearcBarging,
  createNewBarging,
  updateBarging,
  deleteBarging,
  readBarging,
};
