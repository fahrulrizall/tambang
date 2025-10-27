const express = require("express");
const { query } = require("express-validator");
const TugBoatController = require("../controller/tugboat.js");
const { CheckUserRole } = require("../middleware/index.js");
const { allRole } = require("../constant/index.js");

const TugBoatRoutes = express.Router();

TugBoatRoutes.get(
  "/list",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  TugBoatController.pagedSearcTugBoat
);
TugBoatRoutes.post(
  "/",
  CheckUserRole(allRole),
  TugBoatController.createNewTugBoat
);
TugBoatRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  TugBoatController.updateTugBoat
);
TugBoatRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  TugBoatController.deleteTugBoat
);
TugBoatRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  TugBoatController.readTugBoat
);

module.exports = TugBoatRoutes;
