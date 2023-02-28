import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const usersSchema = Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  onboardingStatus: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  gender:String,
  dob:String,
  country:String,
  state:String,
  city:String,
  pincode:Number,
  photo:String
}).plugin(timestamps);

export const Users = mongoose.model("users", usersSchema);
