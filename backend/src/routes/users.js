const express = require("express");
const { body, query } = require("express-validator");
const UserController = require("../controller/users.js");
const { CheckUserRole } = require("../middleware/index.js");
const { masterRole } = require("../constant/index.js");

const UsersRoutes = express.Router();

UsersRoutes.get(
  "/search",
  CheckUserRole(masterRole),
  [query("pageIndex").not().isEmpty(), query("pageSize").not().isEmpty()],
  UserController.pagedSearchUsers
);
UsersRoutes.post(
  "/",
  // CheckUserRole(masterRole),
  [
    body("name").isLength({ min: 3 }).withMessage("name min 3"),
    body("email").isEmail().withMessage("invalid email address"),
    body("username").isLength({ min: 8 }).withMessage("username min 8"),
    body("password").isLength({ min: 8 }).withMessage("password min 8"),
  ],
  UserController.createNewUser
);
UsersRoutes.patch(
  "/:uuid",
  CheckUserRole(masterRole),
  [
    body("name").isLength({ min: 3 }).withMessage("name min 3"),
    body("email").isEmail().withMessage("invalid email address"),
  ],
  UserController.updateUser
);
UsersRoutes.delete(
  "/:uuid",
  CheckUserRole(masterRole),
  UserController.deleteUser
);
UsersRoutes.get("/:uuid", CheckUserRole(masterRole), UserController.readUser);

module.exports = UsersRoutes;
