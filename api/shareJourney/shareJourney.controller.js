import { generateControllers } from "../../modules/query";
import { ShareJourney } from "./shareJourney.model";

const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD
    }
});

const getAllShareJourney = async (req, res) => {
  try {
    const result = await ShareJourney.find({"journeyDetails.seat": { $gt: 0 }});
    res.status(200).send(result);
  } catch (err) {
    console.log("Error", err);
    res.status(422).send({error: "Error in getting user time info"});
  }
};

const updateDetails = async (req, res) => {
  try {
    const data = req.body;
    console.log(data.email)
    let result = await ShareJourney.findByIdAndUpdate(req.params.Journey_id,{
        $addToSet: {
            joinUserDetails: data
        }
    });
    if(Object.keys(result).length > 0){
        console.log("sakjdkajshdk",result.journeyDetails.seat)
        if(result.journeyDetails.seat  !== 0){
            const av = result.journeyDetails.seat - data.seat
            await ShareJourney.findByIdAndUpdate(req.params.Journey_id,{
                "journeyDetails.seat":av
            })
            const mailOptions = {
                to: data.email,
                from: process.env.MAILER_EMAIL_ID,
                subject: "Ride Details",
                text:
                    "\b Journey Details Given Below:\n\n" +
                    "Dealer Email : " + result.email + "\n" +
                    "Dealer Mobile : " + result.mobile + "\n" +
                    "Journey Date : " + result.journeyDetails.date + "\n" +
                    "Pickup Location : " + result.journeyDetails.pickup + "\n" +
                    "Time : " + result.journeyDetails.hours + "." + result.journeyDetails.minute + " " + result.journeyDetails.time + "\n" +
                    "No of Seat : " + result.journeyDetails.seat + "\n" +
                    "Rent value :" + result.journeyDetails.rent + "\n"
            };
            smtpTransport.sendMail(mailOptions, function (err, info) {
                if(err){
                    console.log(err)
                    return res.status(200).send({ success: false, message: "something went wrong" });
                }
                else{
                    console.log(info);
                    return  res.status(200).send({ success: true, message: "Check the mail and reset the password" });
                }
            });
        }
    }else{
        res.status(200).send(result);
    }

  } catch (err) {
    console.log("Error", err);
    res.status(422).send({error: "Error in getting user time info"});
  }
};

export default generateControllers(ShareJourney, {
    updateDetails,getAllShareJourney
});
