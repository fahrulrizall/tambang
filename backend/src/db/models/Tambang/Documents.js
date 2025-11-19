const { Model, DataTypes } = require("sequelize");
const { AuditableField } = require("../../../constant");
const sequelizeConnection = require("../../../config/database-connection");

class Documents extends Model {
  static associate(models) {}
}

Documents.init(
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
      type: DataTypes.INTEGER(),
    },
    alongside: {
      type: DataTypes.STRING(),
    },
    loading: {
      type: DataTypes.STRING(),
    },
    castedOff: {
      type: DataTypes.STRING(),
    },
    ...AuditableField,
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    modelName: "documents",
    tableName: "documents",
  }
);

module.exports = Documents;
