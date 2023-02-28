import mongoose, { Schema } from "mongoose"
import timestamps from "mongoose-timestamp"

const buyerSchema = Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  vehicleId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  orderId:{
    type:String,
    required:true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  aadharNumber: {
    type: Number,
    required: true
  },
  drivingLicenceNumber: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  additionalInfo: String,
  bookingDetails:{
    type:Object,
    required:true
  }
}).plugin(timestamps)

export const Buyer = mongoose.model("buyer", buyerSchema)
