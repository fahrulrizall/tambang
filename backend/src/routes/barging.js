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
  "/list/group",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  BargingController.groupedBarging
);
BargingRoutes.get(
  "/list/detail/:bargingUuid",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  BargingController.pagedSearcBargingDetail
);
BargingRoutes.get(
  "/list/detail/no/:noBarging",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  BargingController.pagedSearcBargingDetailByNo
);
BargingRoutes.post(
  "/",
  CheckUserRole(allRole),
  BargingController.createNewBarging
);
BargingRoutes.post(
  "/detail",
  CheckUserRole(allRole),
  BargingController.createNewBargingDetail
);
BargingRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.updateBarging
);
BargingRoutes.patch(
  "/detail/:uuid",
  CheckUserRole(allRole),
  BargingController.updateBargingDetail
);
BargingRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.deleteBarging
);
BargingRoutes.delete(
  "/detail/:uuid",
  CheckUserRole(allRole),
  BargingController.deleteBargingDetail
);
BargingRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.readBarging
);
BargingRoutes.get(
  "/detail/:uuid",
  CheckUserRole(allRole),
  BargingController.readBargingDetail
);

module.exports = BargingRoutes;
