const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const sequelizeConnection = require("../config/database-connection.js");
const { decodeToken } = require("../utils/index.js");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const pagedSearchUsers = async (req, res) => {
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
    const whereCondition = {
      ...(keyword && {
        [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }],
      }),
    };

    const result = await User.findAndCountAll({
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
    res.status(500).json({
      message: error,
    });
  }
};

const createNewUser = async (req, res) => {
  const errros = validationResult(req);
  const request = req.body;

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  const email = await User.findOne({
    where: {
      email: request.email,
    },
    raw: true,
  });

  if (email) {
    return res.status(400).json({
      messages: "Email already exist",
    });
  }

  const username = await User.findOne({
    where: {
      username: request.username,
    },
    raw: true,
  });

  if (username) {
    return res.status(400).json({
      messages: "Username already exist",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(request.password, salt);

  const data = {
    name: request.name,
    email: request.email,
    password: hashPassword,
    username: request.username,
    uuid: uuidv4(),
  };

  const transaction = await sequelizeConnection.transaction();

  try {
    await User.create(
      {
        ...data,
        createdBy: decodeToken(req, "uuid"),
        createdDateTime: moment(new Date().toUTCString()).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      messages: request,
    });
  } catch (error) {
    if (error != null && error instanceof Error) {
      return res.status(500).send({
        status: 500,
        message: error.message,
        errors: error,
      });
    }

    return res.status(500).send({
      status: 500,
      message: "Internal server error",
      errors: error,
    });
  }
};

const updateUser = async (req, res) => {
  const { uuid } = req.params;
  const request = req.body;
  const errros = validationResult(req);

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  const data = await User.findOne({
    where: {
      uuid: uuid,
    },
    raw: true,
  });

  if (!data) {
    return res.status(400).json({
      messages: "uuid not exist",
    });
  }

  const transaction = await sequelizeConnection.transaction();

  try {
    await User.update(
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
      data: {
        id: uuid,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteUser = async (req, res) => {
  const { uuid } = req.params;

  const data = await User.findOne({
    where: {
      uuid: uuid,
    },
    raw: true,
  });

  if (!data) {
    return res.status(400).json({
      messages: "uuid not exist",
    });
  }

  const transaction = await sequelizeConnection.transaction();

  try {
    await User.destroy({
      where: { uuid: uuid },
      transaction,
    });
    res.json({
      id: uuid,
    });
  } catch (error) {
    res.status(500).json({
      message: `delete user ${uuid}`,
    });
  }
};

const readUser = async (req, res) => {
  const { uuid } = req.params;

  try {
    const result = await User.findOne({
      where: {
        uuid: uuid,
      },
      raw: true,
    });

    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: `uuid not exist`,
    });
  }
};

module.exports = {
  pagedSearchUsers,
  createNewUser,
  updateUser,
  deleteUser,
  readUser,
};
