import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const shareJourneySchema = Schema({
  fullName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  photo:String,
  journeyDetails:{
    date: {
      type: String,
      required: true
    },
    pickup: {
      type: String,
      required: true
    },
    hours: {
      type: Number,
      required: true
    },
    dropLocation: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    seat: {
      type: Number,
      required: true
    },
    minute: {
      type: Number,
      required: true
    },
    rent: {
      type: Number,
      required: true
    },
  },
  company: {
    type: String,
    required: true
  },
  modal: {
    type: String,
    required: true
  },
  joinUserDetails: [{
    joinUserId: mongoose.Schema.Types.ObjectId,
    email:String,
    mobile:Number,
    seat:Number
  }],
  status: {
    type: Boolean,
    required: true
  },
}).plugin(timestamps);

export const ShareJourney = mongoose.model("shareJourney", shareJourneySchema);
