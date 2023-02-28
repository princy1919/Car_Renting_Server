import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const commentSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  comment: String,
}).plugin(timestamps);

export const Comment = mongoose.model("comments", commentSchema);
