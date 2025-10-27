const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const UsersModel = require("../models/users.js");

const pagedSearchUsers = async (req, res) => {
  const errros = validationResult(req);
  const { pageIndex, pageSize } = req.query;

  if (!errros.isEmpty()) {
    return res.status(400).json({
      messages: errros.array(),
    });
  }

  try {
    const [data] = await UsersModel.pagedSearchUsers(pageIndex, pageSize);

    const [totalCountUsers] = await UsersModel.totalCountUsers();

    res.json({
      totalCount: totalCountUsers[0].totalCount,
      data: data,
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

  const [email] = await UsersModel.emailUserExist(request.email);

  if (email.length > 0) {
    return res.status(400).json({
      messages: "Email already exist",
    });
  }

  const [username] = await UsersModel.userNameExist(request.username);

  if (username.length > 0) {
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
    plantUuid: request.plantUuid,
  };

  try {
    await UsersModel.createNewUser(data);
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

  const [data] = await UsersModel.readUser(uuid);

  if (data.length === 0) {
    return res.status(400).json({
      messages: "uuid not exist",
    });
  }

  try {
    await UsersModel.updateUser(request, uuid);
    res.json({
      data: {
        id: uuid,
        ...request,
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

  const [data] = await UsersModel.readUser(uuid);

  if (data.length === 0) {
    return res.status(400).json({
      messages: "uuid not exist",
    });
  }

  try {
    await UsersModel.deleteUser(uuid);
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
    const [data] = await UsersModel.readUser(uuid);

    res.json({
      data: data[0],
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
