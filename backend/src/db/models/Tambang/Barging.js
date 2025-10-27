const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class Barging extends Model {
  static associate(models) {}
}

Barging.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    no: {
      type: DataTypes.NUMBER(),
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    mv: {
      type: DataTypes.STRING(),
    },
    company: {
      type: DataTypes.STRING(),
    },
    date: {
      type: DataTypes.DATE(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "barging",
    tableName: "barging",
  }
);

module.exports = Barging;
