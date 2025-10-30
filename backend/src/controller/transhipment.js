const { validationResult } = require("express-validator");
const {
  Transhipment,
  VwTranshipment,
  VwBargingDetail,
  BargingDetail,
} = require("../db/models");
const sequelize = require("sequelize");
const { ApiError } = require("../Helper/Error.js");
const { v4: uuidv4 } = require("uuid");
const { decodeToken } = require("../utils/index.js");
const moment = require("moment");
const sequelizeConnection = require("../config/database-connection.js");

const pagedSearchTranshipment = async (req, res) => {
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

    const result = await VwTranshipment.findAndCountAll({
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

const createNewTranshipment = async (req, res) => {
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
    await Transhipment.create({
      ...request,
      createdBy: decodeToken(req, "uuid"),
      createdDateTime: moment(new Date().toUTCString()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    await BargingDetail.destroy({
      where: { bargingUuid: request.bargingUuid },
      transaction,
    });

    const details = request.detail.map((item) => ({
      ...item,
      uuid: uuidv4(),
      bargingUuid: request.bargingUuid,
      createdBy: decodeToken(req, "uuid"),
      createdDateTime: moment(new Date().toUTCString()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    }));

    if (details.length > 0) {
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

const updateTranshipment = async (req, res) => {
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
    console.log(request);
    await Transhipment.update(
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
      where: { bargingUuid: request.bargingUuid },
      transaction,
    });

    const details = request.detail.map((item) => ({
      ...item,
      uuid: uuidv4(),
      bargingUuid: request.bargingUuid,
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

const deleteTranshipment = async (req, res) => {
  const { uuid } = req.params;

  try {
    await Transhipment.destroy({
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

const readTranshipment = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await VwTranshipment.findOne({
      where: {
        uuid: uuid,
      },
      raw: true,
    });

    const detail = await VwBargingDetail.findAll({
      where: {
        bargingUuid: result.bargingUuid,
      },
      raw: true,
    });

    res.json({
      ...result,
      blending: result.blending ? true : false,
      detail: detail,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

module.exports = {
  pagedSearchTranshipment,
  createNewTranshipment,
  updateTranshipment,
  deleteTranshipment,
  readTranshipment,
};
