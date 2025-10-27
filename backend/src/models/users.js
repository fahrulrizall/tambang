const { v4: uuidv4 } = require("uuid");
const DBpool = require("../config/database.js");

const pagedSearchUsers = (pageIndex, pageSize) => {
  const SQLQuery = `SELECT uuid, name, username, email FROM users ORDER BY createdDateTime DESC LIMIT ${pageSize} OFFSET ${
    pageIndex * pageSize
  }`;

  return DBpool.execute(SQLQuery);
};

const totalCountUsers = () => {
  const SQLQuery = `SELECT COUNT(*) as totalCount FROM users`;

  return DBpool.execute(SQLQuery);
};

const createNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (uuid, name, username, email, password, plantUuid, createdDateTime) VALUES ('${uuidv4()}','${
    body.name
  }','${body.username}','${body.email}','${body.password}', '${
    body.plantUuid
  }', UTC_TIMESTAMP())`;

  return DBpool.execute(SQLQuery);
};

const updateUser = (body, uuid) => {
  const SQLQuery = `UPDATE users SET name='${body.name}', email='${body.email}' WHERE uuid='${uuid}'`;

  return DBpool.execute(SQLQuery);
};

const deleteUser = (uuid) => {
  const SQLQuery = `DELETE FROM users WHERE uuid='${uuid}'`;

  return DBpool.execute(SQLQuery);
};

const readUser = (uuid) => {
  const SQLQuery = `SELECT * FROM users WHERE uuid='${uuid}'`;

  return DBpool.execute(SQLQuery);
};

const emailUserExist = (email) => {
  const SQLQuery = `SELECT email FROM users WHERE email='${email}'`;

  return DBpool.execute(SQLQuery);
};

const userNameExist = (username) => {
  const SQLQuery = `SELECT users.uuid, users.username, users.password, users.role, plants.uuid as plantUuid, plants.plantCode FROM users JOIN plants 
  ON users.plantUuid = plants.uuid
  WHERE users.username='${username}'`;

  return DBpool.execute(SQLQuery);
};

const updateRefreshToken = (token, uuid) => {
  const SQLQuery = `UPDATE users SET refreshToken='${token}' WHERE uuid='${uuid}'`;

  return DBpool.execute(SQLQuery);
};

const readRefreshToken = (token) => {
  const SQLQuery = `SELECT refreshToken, uuid, username, role FROM users WHERE refreshToken='${token}'`;

  return DBpool.execute(SQLQuery);
};

module.exports = {
  pagedSearchUsers,
  createNewUser,
  totalCountUsers,
  updateUser,
  deleteUser,
  readUser,
  emailUserExist,
  userNameExist,
  updateRefreshToken,
  readRefreshToken,
};
