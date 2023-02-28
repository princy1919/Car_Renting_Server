import express from "express";
import usersController from "./users.controller";

export const usersRouter = express.Router();


usersRouter
  .route("/")
  .get(usersController.getAll)
  .post(usersController.createOne);
usersRouter
  .route("/profile")
  .post(usersController.ProfileData);
usersRouter
  .route("/count")
  .get(usersController.countData);
usersRouter
  .route("/count")
  .get(usersController.countData);
usersRouter
  .route("/updateprofiledetails/:Users_id")
  .put(usersController.UpdateProfileData);


