const { validationResult } = require("express-validator");
const {
  Transhipment,
  VwTranshipment,
  TranshipmentDetail,
  VwTranshipmentDetail,
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
        [Op.or]: [
          sequelize.where(sequelize.fn("LOWER", sequelize.col("mv")), {
            [Op.like]: `%${keyword.toLowerCase()}%`,
          }),
        ],
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

const pagedSearchTranshipmentDetail = async (req, res) => {
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
          sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
            [Op.like]: `%${keyword.toLowerCase()}%`,
          }),
        ],
      }),
      ...(transhipmentUuid && { transhipmentUuid: transhipmentUuid }),
    };

    const result = await VwTranshipmentDetail.findAll({
      where: whereCondition,
      // limit: parseInt(pageSize),
      // offset: parseInt(pageSize * pageIndex),
      order: order,
    });

    const totalWeight = await VwTranshipmentDetail.sum("cargoOnb", {
      where: whereCondition,
    });

    res.json({
      data: result,
      totalCount: result.count,
      totalWeight: totalWeight,
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
    await Transhipment.create(
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

const createNewTranshipmentDetail = async (req, res) => {
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
    await TranshipmentDetail.create(
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

    await transaction.commit();

    res.json({
      id: uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const updateTranshipmentOneByOneField = async (req, res) => {
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
    const result = await Transhipment.findOne({
      where: {
        uuid: uuid,
      },
      raw: true,
    });

    await Transhipment.update(
      {
        ...request,
        ...result,
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

    await transaction.commit();

    res.json({
      id: uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const updateTranshipmentDetail = async (req, res) => {
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
    await TranshipmentDetail.update(
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
    const transaction = await sequelizeConnection.transaction();

    await Transhipment.destroy(
      {
        where: {
          uuid,
        },
      },
      {
        transaction,
      }
    );

    await TranshipmentDetail.destroy(
      {
        where: {
          transhipmentUuid: uuid,
        },
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const deleteTranshipmentDetail = async (req, res) => {
  const { uuid } = req.params;

  try {
    const transaction = await sequelizeConnection.transaction();

    await TranshipmentDetail.destroy(
      {
        where: {
          uuid,
        },
      },
      { transaction }
    );

    await transaction.commit();

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

    res.json({
      ...result,
      blending: result.blending ? true : false,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const readTranshipmentDetail = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await VwTranshipmentDetail.findOne({
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
  pagedSearchTranshipment,
  pagedSearchTranshipmentDetail,
  createNewTranshipment,
  createNewTranshipmentDetail,
  updateTranshipment,
  updateTranshipmentDetail,
  deleteTranshipment,
  deleteTranshipmentDetail,
  readTranshipment,
  readTranshipmentDetail,
  updateTranshipmentOneByOneField,
};
