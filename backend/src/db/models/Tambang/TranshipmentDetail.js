const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class TranshipmentDetail extends Model {
  static associate(models) {}
}

TranshipmentDetail.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    transhipmentUuid: {
      type: DataTypes.UUID(),
    },
    bargingDetailUuid: {
      type: DataTypes.UUID(),
    },
    no: {
      type: DataTypes.NUMBER(),
      autoIncrement: true,
      allowNull: false,
      unique: true,
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
    alongside: {
      type: DataTypes.DATE(),
    },
    cargoOnb: {
      type: DataTypes.FLOAT(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "transhipmentdetail",
    tableName: "transhipmentdetail",
  }
);

module.exports = TranshipmentDetail;
