const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../constant");
const sequelizeConnection = require("../../config/database-connection");

class User extends Model {
  static associate(models) {}
}

User.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(),
    },
    username: {
      type: DataTypes.STRING(),
    },
    email: {
      type: DataTypes.STRING(),
    },
    password: {
      type: DataTypes.DATE(),
    },
    refreshToken: {
      type: DataTypes.DATE(),
    },
    plantUuid: {
      type: DataTypes.DATE(),
    },
    role: {
      type: DataTypes.DATE(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "users",
    tableName: "users",
  }
);

module.exports = User;
