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
      type: DataTypes.FLOAT(),
    },
    ptb: {
      type: DataTypes.STRING(),
    },
    barge: {
      type: DataTypes.STRING(),
    },
    gtbg: {
      type: DataTypes.FLOAT(),
    },
    pbg: {
      type: DataTypes.FLOAT(),
    },
    feet: {
      type: DataTypes.FLOAT(),
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
