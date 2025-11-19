const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class Remarks extends Model {
  static associate(models) {}
}

Remarks.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    transhipmentUuid: {
      type: DataTypes.UUID(),
    },
    descriptions: {
      type: DataTypes.STRING(),
    },
    start: {
      type: DataTypes.DATE(),
    },
    end: {
      type: DataTypes.DATE(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "remarks",
    tableName: "remarks",
  }
);

module.exports = Remarks;
