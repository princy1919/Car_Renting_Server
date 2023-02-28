import express from "express";
import shareJourneyController from "./shareJourney.controller";
import {updateStatus} from "../vehicals/vehicle.controller";
import {vehicleRouter} from "../vehicals";

export const shareJourney = express.Router();


shareJourney
  .route("/")
  .get(shareJourneyController.getAllShareJourney)
  .post(shareJourneyController.createOne)

shareJourney
   .route("/update/:Journey_id")
   .put(shareJourneyController.updateDetails);



