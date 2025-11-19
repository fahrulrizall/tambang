const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class CargoHold extends Model {
  static associate(models) {}
}

CargoHold.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    transhipmentUuid: {
      type: DataTypes.UUID(),
    },
    no: {
      type: DataTypes.INTEGER(),
    },
    kjb: {
      type: DataTypes.STRING(),
    },
    haa: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "cargoHold",
    tableName: "cargoHold",
  }
);

module.exports = CargoHold;
