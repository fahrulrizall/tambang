const express = require("express");
const { query } = require("express-validator");
const RemarksController = require("../controller/remarks.js");
const { CheckUserRole } = require("../middleware/index.js");
const { allRole } = require("../constant/index.js");

const RemarksRoutes = express.Router();

RemarksRoutes.get(
  "/list/:transhipmentUuid",
  CheckUserRole(allRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  RemarksController.pagedSearcRemarks
);
RemarksRoutes.post(
  "/",
  CheckUserRole(allRole),
  RemarksController.createNewRemakrs
);
RemarksRoutes.patch(
  "/:uuid",
  CheckUserRole(allRole),
  RemarksController.updateRemarks
);
RemarksRoutes.delete(
  "/:uuid",
  CheckUserRole(allRole),
  RemarksController.deleteRemarks
);
RemarksRoutes.get(
  "/:uuid",
  CheckUserRole(allRole),
  RemarksController.readRemarks
);

module.exports = RemarksRoutes;
