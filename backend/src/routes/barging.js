const express = require("express");
const { query } = require("express-validator");
const BargingController = require("../controller/barging.js");
const { CheckUserRole } = require("../middleware/index.js");
const { allRole } = require("../constant/index.js");

const BargingRoutes = express.Router();

BargingRoutes.get(
  "/list",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  BargingController.pagedSearcBarging
);
BargingRoutes.get(
  "/list/detail/:bargingUuid",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  BargingController.pagedSearcBargingDetail
);
BargingRoutes.post(
  "/",
  CheckUserRole(allRole),
  BargingController.createNewBarging
);
BargingRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.updateBarging
);
BargingRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.deleteBarging
);
BargingRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.readBarging
);

module.exports = BargingRoutes;
