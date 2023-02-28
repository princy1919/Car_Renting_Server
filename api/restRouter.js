import express from "express"

import { usersRouter } from "./users"
import { vehicleRouter } from "./vehicals"
import { buyerRouter } from "./buyerUser"
import { shareJourney } from "./shareJourney"
import { commentsRouter } from "./comments"

export const restRouter = express.Router()

// The authorization routes go here Api Routs
restRouter.use("/users", usersRouter)
restRouter.use("/vehicle", vehicleRouter)
restRouter.use("/buyer", buyerRouter)
restRouter.use("/journey", shareJourney)
restRouter.use("/comments", commentsRouter)

