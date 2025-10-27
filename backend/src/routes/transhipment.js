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
TranshipmentRoutes.post(
  "/",
  CheckUserRole(allRole),
  TranshipmentController.createNewTranshipment
);
TranshipmentRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.updateTranshipment
);
TranshipmentRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.deleteTranshipment
);
TranshipmentRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  TranshipmentController.readTranshipment
);

module.exports = TranshipmentRoutes;
