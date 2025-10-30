const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const sequelizeConnection = require("../config/database-connection.js");
const { decodeToken } = require("../utils/index.js");

const login = async (req, res) => {
  try {
    const data = await User.findOne({
      where: {
        username: req.body.username,
      },
      raw: true,
    });

    if (!data) {
      return res.status(400).json({
        message: `wrong email or password`,
      });
    }

    const isMatchPassword = await bcrypt.compare(
      req.body.password,
      data.password
    );

    if (!isMatchPassword) {
      return res.status(400).json({
        message: `wrong email or password`,
      });
    }

    const uuid = data.uuid;
    const username = data.username;
    const role = data.role;

    const accessToken = jwt.sign(
      { uuid, username, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      { uuid, username, role },
      process.env.REFRESH_TOKEN_SECRET
    );

    const transaction = await sequelizeConnection.transaction();

    try {
      await User.update(
        {
          ...data,
          refreshToken: refreshToken,
          lastModifiedBy: decodeToken(req, "uuid"),
          lastModifiedDateTime: moment(new Date().toUTCString()).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        },
        {
          where: {
            uuid: uuid,
          },
          transaction,
        }
      );
      await transaction.commit();
    } catch (error) {
      console.log(error);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
    const refreshTokenExpiration = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 days from now

    res.json({
      accessToken,
      accessTokenExpiration,
      refreshToken,
      refreshTokenExpiration,
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const transaction = await sequelizeConnection.transaction();

  const data = await User.findOne(
    {
      where: {
        refreshToken: refreshToken,
      },
      raw: true,
    },
    {
      transaction,
    }
  );

  if (!data) return res.sendStatus(204);
  const uuid = data.uuid;

  try {
    await User.update(
      {
        ...data,
        refreshToken: null,
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
  } catch (error) {
    console.log(error);
  }

  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const transaction = await sequelizeConnection.transaction();

    const data = await User.findOne(
      {
        where: {
          refreshToken: refreshToken,
        },
        raw: true,
      },
      {
        transaction,
      }
    );

    if (!data) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.sendStatus(403);

        const uuid = data[0].uuid;
        const username = data[0].username;
        const role = data[0].role;

        const accessToken = jwt.sign(
          { uuid, username, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.json({
          accessToken,
        });
      }
    );
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = { login, logout, refreshToken };
