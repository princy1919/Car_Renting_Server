import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";
import appConfig from "./config";

mongoose.Promise = global.Promise;
mongoose.plugin(timestamps);

export const connect = (config = appConfig) => {
  mongoose.set("useCreateIndex", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useUnifiedTopology", true);
  mongoose.connect(
      config.db.url
  ).then(() => console.log("DB Connected!"))
      .catch(err => {
        console.log(Error, err.message);
      });
};
