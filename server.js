import {requireAuth} from "./auth/auth.middleware";
const express = require('express')
import cors from "cors"
import setupMiddware from "./middlewares"
import { restRouter, apiErrorHandler } from "./api"
import { authRouter } from "./auth"
import { connect } from "./db"
console.log("THIS IS THE ENVIRONMENT", process.env.PLATFORM_NODE_ENV)
// Declare an app from express
const app = express();


setupMiddware(app);

require("dotenv").config();

connect();

app.use(cors());

app.use("/auth", (req, res, next) => {
  // res.header("Access-Control-Allow-Origin", process.env.PLATFORM_FRONTEND_URL ) // Access-Control-Allow-Origin
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Al" +
      "low-Methods"
  );
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  next()
});

app.use("/auth", authRouter);

app.use("/api", (req, res, next) => {
  // res.header("Access-Control-Allow-Origin", process.env.PLATFORM_FRONTEND_URL)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Al" +
      "low-Methods"
  );
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  next()
});

app.use("/api"/*requireAuth*/ ,restRouter);
app.use(apiErrorHandler);


export default app
