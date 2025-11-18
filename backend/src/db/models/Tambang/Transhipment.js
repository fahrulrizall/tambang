const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class Transhipment extends Model {
  static associate(models) {}
}

Transhipment.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    stowagePlan: {
      type: DataTypes.STRING(),
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
    norTendered: {
      type: DataTypes.DATE(),
    },
    tendered: {
      type: DataTypes.STRING(),
    },
    noBarging: {
      type: DataTypes.INTEGER(),
    },
    prevCargo: {
      type: DataTypes.STRING(),
    },
    loadingRateDTD: {
      type: DataTypes.STRING(),
    },
    loadingRatePTD: {
      type: DataTypes.STRING(),
    },
    tph: {
      type: DataTypes.STRING(),
    },
    completedLoading: {
      type: DataTypes.DATE(),
    },
    remarks: {
      type: DataTypes.DATE(),
    },
    cargoPerHold: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "transhipment",
    tableName: "transhipment",
  }
);

module.exports = Transhipment;
