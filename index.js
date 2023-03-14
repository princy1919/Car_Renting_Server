import http from "http";

import app from "./server";

require("dotenv").config();

let server = null;

if (process.env.PLATFORM_NODE_ENV === "development") {
  server = http.createServer(app);
} else {
  console.log("This is the production environment");
  server = app;
}

const PORT = process.env.PLATFORM_PORT || 8080;
server.listen(PORT, async () => {
  try {
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    console.log("Server init error", err);
  }
});
