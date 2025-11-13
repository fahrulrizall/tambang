const { validationResult } = require("express-validator");
const { Barging, BargingDetail, VwBargingDetail } = require("../db/models");
const sequelize = require("sequelize");
const { ApiError } = require("../Helper/Error.js");
const { v4: uuidv4 } = require("uuid");
const { decodeToken } = require("../utils/index.js");
const moment = require("moment");
const sequelizeConnection = require("../config/database-connection.js");
const { QueryTypes } = require("sequelize");

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

const groupedBarging = async (req, res) => {
  try {
    const page = parseInt(req.query.pageIndex) || 1;
    const limit = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * limit;

    // ✅ Main grouped query
    const results = await sequelizeConnection.query(
      `
      SELECT 
        MAX(uuid) AS uuid,
        no,
      MAX(mv) as mv,
        MAX(date) AS date,
        MAX(createdDateTime) AS createdAt
      FROM barging
      GROUP BY no
      ORDER BY MAX(createdDateTime) DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { limit, offset },
        type: QueryTypes.SELECT,
      }
    );

    // ✅ Count total grouped rows for pagination
    const totalResult = await sequelizeConnection.query(
      `
      SELECT COUNT(*) AS total
      FROM (
        SELECT no
        FROM barging
        GROUP BY no
      ) AS grouped
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const total = totalResult[0].total;

    res.json({
      data: results,
      totalCount: total,
      pageIndex: page,
      pageSize: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching barging data",
      error: error.message,
    });
  }
};

const pagedSearcBargingDetail = async (req, res) => {
  const errros = validationResult(req);
  const { bargingUuid } = req.params;
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
        [Op.and]: [
          sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
            [Op.like]: `%${keyword.toLowerCase()}%`,
          }),
        ],
      }),
      ...(bargingUuid && { bargingUuid }),
    };

    const result = await VwBargingDetail.findAll({
      where: whereCondition,
      // limit: parseInt(pageSize),
      // offset: parseInt(pageSize * pageIndex),
      order: order,
    });

    const totalWeight = await VwBargingDetail.sum("cargo", {
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

    await transaction.commit();

    res.status(201).json({
      id: request.code,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const createNewBargingDetail = async (req, res) => {
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
    await BargingDetail.create(
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

    await transaction.commit();

    res.json({
      id: uuid,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const updateBargingDetail = async (req, res) => {
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
    await BargingDetail.update(
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

const deleteBarging = async (req, res) => {
  const { uuid } = req.params;
  const transaction = await sequelizeConnection.transaction();

  try {
    if (!uuid) {
      return res.status(400).json({ message: "UUID is required" });
    }

    const barging = await Barging.findOne({ where: { uuid }, transaction });
    if (!barging) {
      await transaction.rollback();
      return res.status(404).json({ message: "Barging not found" });
    }

    await BargingDetail.destroy({ where: { bargingUuid: uuid }, transaction });
    await Barging.destroy({ where: { uuid }, transaction });

    await transaction.commit();

    res.json({ message: "Deleted successfully", uuid });
  } catch (error) {
    await transaction.rollback();
    ApiError(res, error);
  }
};

const deleteBargingDetail = async (req, res) => {
  const { uuid } = req.params;

  const transaction = await sequelizeConnection.transaction();

  try {
    await BargingDetail.destroy({
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

    res.json({
      ...result.dataValues,
    });
  } catch (error) {
    ApiError(res, error);
  }
};

const readBargingDetail = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await VwBargingDetail.findOne({
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
  pagedSearcBarging,
  pagedSearcBargingDetail,
  createNewBarging,
  createNewBargingDetail,
  updateBarging,
  updateBargingDetail,
  deleteBarging,
  deleteBargingDetail,
  readBarging,
  readBargingDetail,
  groupedBarging,
};
