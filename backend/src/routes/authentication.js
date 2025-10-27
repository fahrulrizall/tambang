const express = require("express");
const AuthController = require("../controller/authentication.js");

const AuthenticationRoutes = express.Router();

AuthenticationRoutes.post("/login", AuthController.login);
AuthenticationRoutes.delete("/logout", AuthController.logout);
AuthenticationRoutes.get("/token", AuthController.refreshToken);

module.exports = AuthenticationRoutes;
