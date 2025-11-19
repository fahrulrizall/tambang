const express = require("express");
const { query } = require("express-validator");
const CargoHoldController = require("../controller/cargohold.js");
const { CheckUserRole } = require("../middleware/index.js");
const { allRole } = require("../constant/index.js");

const CargoRoutes = express.Router();

CargoRoutes.get(
  "/list/:transhipmentUuid",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  CargoHoldController.pagedSearcCargoHold
);
CargoRoutes.post(
  "/",
  CheckUserRole(allRole),
  CargoHoldController.createNewCargoHold
);
CargoRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  CargoHoldController.updateCargoHold
);
CargoRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  CargoHoldController.deleteCargoHold
);
CargoRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  CargoHoldController.readCargoHold
);

module.exports = CargoRoutes;
