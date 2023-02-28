import bodyParser from "body-parser"

require("dotenv").config()

const requestIp = require("request-ip")


const setGlobalMiddleware = (app) => {
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))
  app.use(bodyParser.json({limit: "50mb"}))
  app.use(bodyParser.text({ type: "application/x-ndjson" }))
  app.use(requestIp.mw())
};

export default setGlobalMiddleware
