const { DataTypes } = require("sequelize");
const allRole = ["MASTER", "QC", "ADMIN"];
const masterRole = ["MASTER"];
const qcRole = ["QC"];
const adminRole = ["ADMIN"];
const masterAdminRole = ["MASTER", "ADMIN"];
const plant = {
  CSM: "CSM",
};

const AuditableField = {
  createdDateTime: {
    type: DataTypes.DATE,
  },
  createdBy: {
    type: DataTypes.STRING,
  },
  lastModifiedDateTime: {
    type: DataTypes.DATE,
  },
  lastModifiedBy: {
    type: DataTypes.STRING,
  },
};

module.exports = {
  allRole,
  masterRole,
  qcRole,
  adminRole,
  masterAdminRole,
  plant,
  AuditableField,
};
