import express from "express"
import { createBuyer,findBuyer,generatePdf} from "./buyer.controller"

export const buyerRouter = express.Router()

buyerRouter.route("/:id").get(findBuyer)
buyerRouter.route("/create").post(createBuyer)
buyerRouter.route("/pdf").post(generatePdf);




