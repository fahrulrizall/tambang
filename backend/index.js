const express = require("express");
const app = express();
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  AuthenticationRoutes,
  UsersRoutes,
  TugBoatRoutes,
  BargingRoutes,
  TranshipmentRoutes,
} = require("./src/routes");
const { VerifyToken } = require("./src/middleware/index.js");

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://anova-traceability.com",
      "https://staging.anova-traceability.com",
      "https://traceability.anova-traceability.com",
      "http://anovafoodtraceability.my.id",
      "https://anovafoodtraceability.my.id",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("✅ Backend API is running successfully!");
});

app.use("/auth", AuthenticationRoutes);
app.use("/users", VerifyToken, UsersRoutes);
app.use("/tugboat", VerifyToken, TugBoatRoutes);
app.use("/barging", VerifyToken, BargingRoutes);
app.use("/transhipment", VerifyToken, TranshipmentRoutes);
app.listen(process.env.PORT);
