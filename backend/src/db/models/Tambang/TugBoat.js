const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class TugBoat extends Model {
  static associate(models) {}
}

TugBoat.init(
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
    name: {
      type: DataTypes.STRING(),
    },
    gttb: {
      type: DataTypes.STRING(),
    },
    ptb: {
      type: DataTypes.STRING(),
    },
    barge: {
      type: DataTypes.STRING(),
    },
    gtbg: {
      type: DataTypes.STRING(),
    },
    pbg: {
      type: DataTypes.STRING(),
    },
    feet: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "tugboat",
    tableName: "tugboat",
  }
);

module.exports = TugBoat;
