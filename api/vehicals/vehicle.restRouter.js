import express from "express"
import { getCarDetail,registerCar,getCarList,updateData,updateStatus,deleteData} from "./vehicle.controller"

export const vehicleRouter = express.Router()

vehicleRouter.route("/")
    .post(getCarList)

vehicleRouter.route("/registercar")
    .post(registerCar)

vehicleRouter.route("/find")
    .post(getCarDetail)

vehicleRouter.route("/updatedetails/:Vehicle_id")
    .put(updateData);
vehicleRouter.route("/updatestatus/:Vehicle_id")
    .put(updateStatus);
vehicleRouter.route("/:car_id")
    .delete(deleteData);
