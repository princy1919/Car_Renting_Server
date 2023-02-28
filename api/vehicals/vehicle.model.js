import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const vehicleSchema = Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  color:String,
  fuelType:String,
  model:String,
  seat:Number,
  rentValue:Number,
  photos:Array,
  vehicleNumber: {
    type: String,
    required: true
  },
  facilities:Array,
  description:String,
  status:String,
  country:String,
  state:String,
  city:String,
  bagSpace:Number,
  pinCode:Number,
  transmission:String,
  dateOfRegister: {
    type: String,
    required: true
  },
}).plugin(timestamps);

export const Vehicle = mongoose.model("vehicle", vehicleSchema);
