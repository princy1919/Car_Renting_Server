import express from "express";
import commentsController from "./comments.controller";

export const commentsRouter = express.Router();


commentsRouter
    .route("/")
    .get(commentsController.getAll)
    .post(commentsController.createOne);


