const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class VwTranshipmentDetail extends Model {
  static associate(models) {}
}

VwTranshipmentDetail.init(
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
    alongside: {
      type: DataTypes.DATE(),
    },
    cargoOnb: {
      type: DataTypes.STRING(),
    },
    barge: {
      type: DataTypes.STRING(),
    },
    name: {
      type: DataTypes.STRING(),
    },
    remarks: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "vw_transhipmentdetail",
    tableName: "vw_transhipmentdetail",
  }
);

module.exports = VwTranshipmentDetail;
