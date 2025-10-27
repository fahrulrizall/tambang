const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class VwTranshipment extends Model {
  static associate(models) {}
}

VwTranshipment.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    no: {
      type: DataTypes.NUMBER(),
    },
    mv: {
      type: DataTypes.STRING(),
    },
    bargingUuid: {
      type: DataTypes.UUID(),
    },
    stowagePlan: {
      type: DataTypes.FLOAT(),
    },
    loadingPort: {
      type: DataTypes.STRING(),
    },
    dischargingPort: {
      type: DataTypes.STRING(),
    },
    consigne: {
      type: DataTypes.STRING(),
    },
    surveyor: {
      type: DataTypes.STRING(),
    },
    client: {
      type: DataTypes.STRING(),
    },
    notify: {
      type: DataTypes.STRING(),
    },
    blending: {
      type: DataTypes.BOOLEAN(),
    },
    company: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "vw_transhipment",
    tableName: "vw_transhipment",
  }
);

module.exports = VwTranshipment;
