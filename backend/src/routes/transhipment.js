const express = require("express");
const { query } = require("express-validator");
const TranshipmentController = require("../controller/transhipment.js");
const { CheckUserRole } = require("../middleware/index.js");
const { allRole } = require("../constant/index.js");

const TranshipmentRoutes = express.Router();

TranshipmentRoutes.get(
  "/list",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  TranshipmentController.pagedSearchTranshipment
);
TranshipmentRoutes.get(
  "/list/detail/:transhipmentUuid",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  TranshipmentController.pagedSearchTranshipmentDetail
);
TranshipmentRoutes.post(
  "/",
  CheckUserRole(allRole),
  TranshipmentController.createNewTranshipment
);
TranshipmentRoutes.post(
  "/detail",
  CheckUserRole(allRole),
  TranshipmentController.createNewTranshipmentDetail
);
TranshipmentRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.updateTranshipment
);
TranshipmentRoutes.patch(
  "detaul/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.updateTranshipmentDetail
);
TranshipmentRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.deleteTranshipment
);
TranshipmentRoutes.delete(
  "detail/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.deleteTranshipmentDetail
);
TranshipmentRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.readTranshipment
);
TranshipmentRoutes.get(
  "detail/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.readTranshipmentDetail
);

module.exports = TranshipmentRoutes;
