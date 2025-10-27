const express = require("express");
const { query } = require("express-validator");
const BargingController = require("../controller/barging.js");
const { CheckUserRole } = require("../middleware/index.js");
const { allRole } = require("../constant/index.js");

const TugBoatRoutes = express.Router();

TugBoatRoutes.get(
  "/list",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  BargingController.pagedSearcBarging
);
TugBoatRoutes.post(
  "/",
  CheckUserRole(allRole),
  BargingController.createNewBarging
);
TugBoatRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.updateBarging
);
TugBoatRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.deleteBarging
);
TugBoatRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  BargingController.readBarging
);

module.exports = TugBoatRoutes;
