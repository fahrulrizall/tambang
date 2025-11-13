const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class VwBargingDetail extends Model {
  static associate(models) {}
}

VwBargingDetail.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    bargingUuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    tugBoatUuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    no: {
      type: DataTypes.NUMBER(),
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    cargo: {
      type: DataTypes.FLOAT(),
    },
    alongside: {
      type: DataTypes.DATE(),
    },
    arrivedatJetty: {
      type: DataTypes.DATE(),
    },
    commanced: {
      type: DataTypes.DATE(),
    },
    completed: {
      type: DataTypes.DATE(),
    },
    castedOff: {
      type: DataTypes.DATE(),
    },
    remarks: {
      type: DataTypes.STRING(),
    },
    name: {
      type: DataTypes.STRING(),
    },
    barge: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "vw_bargingdetail",
    tableName: "vw_bargingdetail",
  }
);

module.exports = VwBargingDetail;
