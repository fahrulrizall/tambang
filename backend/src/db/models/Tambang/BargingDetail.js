const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class BargingDetail extends Model {
  static associate(models) {}
}

BargingDetail.init(
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
      type: DataTypes.STRING(),
    },
    alongside: {
      type: DataTypes.DATE(),
    },
    barge: {
      type: DataTypes.STRING(),
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
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "bargingdetail",
    tableName: "bargingdetail",
  }
);

module.exports = BargingDetail;
