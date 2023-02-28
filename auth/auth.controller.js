import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import configkeys from "../config";
import { Users } from "../api/users/users.model";
import { getUserDetails } from "../commonDbFunctions";
//Send email
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
const emailConfirmation = (user, emailId) => {
  const token = tokenForUser(user);
  const data = {
    to: emailId,
    from: process.env.MAILER_EMAIL_ID,
    subject: "Confirm your email address to get started ",
    text:
    "Confirm your email address to get started.\n\n" +
    "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
    "http://localhost:8080/auth/signupconfirm?token=" +
    token +
    "\n\n" +
    "If you did not request this, please ignore this email and your password will remain unchanged.\n"
  };
  smtpTransport.sendMail(data, err => {
    return err ? console.log("Email Error==>", err) : "";
    // : res.status(201).send({
    //     success: true,
    //     message: "User created successfully."
    //   });
  });
};

const expirationInterval =
  process.env.NODE_ENV === "development"
    ? 30 * 24 * 60 * 60
    : (parseInt(process.env.JWTSECRET) || 1) * 24 * 60 * 60;

const tokenForUser = (user, loginDetails) => {
  try {
    const timestamp = new Date().getTime();
    return jwt.sign(
      {
        emailId: user.emailId,
        id: user._id,
        firstName: user.firstName,
        // lastName: user.lastName,
        // pic:user.photo,
        // visited:user.visited,
        iat: timestamp,
        // entityDetails: loginDetails.relatedFaEntities[0],
        exp: Math.floor(Date.now() / 1000) + expirationInterval
      },
      configkeys.secrets.JWT_SECRET
    );
  } catch (err) {
    throw err;
  }
};

export const signup = async (req, res) => {
   const data = req.body;
  let { emailId, password  } = req.body;
  emailId = emailId && emailId.toLowerCase();
  const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegexp.test(emailId)) {
    return res.status(422).send({ success: false, message: "Invalid Email" });
  }
  const isEmailExist = await Users.findOne({
    emailId: req.body.emailId
  }).then(data => {
    return data ? true : false;
  });
  if (isEmailExist) {
    return res
      .status(422)
      .send({ success: false, message: "Email is alrady exist" });
  }
  data.password = bcrypt.hashSync(password);
  data.onboardingStatus = "active"
  data.status = "active"
  try {
    await Users.create(data);
     emailConfirmation(req.body, emailId);
    return res.status(201).send({
      success: true,
      message: "User created successfully."
    });
  } catch (err) {
    res.status(422).send({ success: false, message: err.message });
  }
};

export const signin = async (req, res) => {
  const { emailId } = req.body;
  try {
    const [userDetails] = await Promise.all([getUserDetails(emailId)]);
    if (Object.keys(userDetails).length > 0) {
      const status = req.user.onboardingStatus;
      if (status === "new") {
        res
          .status(422)
          .send({ success: false, message: "Please varify your email!" });
      } else if (status === "active") {
        res.status(200).send({
          success: true,
          token: tokenForUser(userDetails)
        });
      } else if (status === "disable") {
        res.status(422).send({
          success: false,
          message: "your account is disabled!"
        });
      }else {
        res.status(404).send({
          success: false,
          error: `your account status is not activated : ${email}`
        });
      }
    } else {
      res.status(422).send({
        success: false,
        error: `Incorrect email ID : ${email}`
      });
    }
  } catch (e) {
    console.log("The error while sign in is", e);
    res.status(422).send({
      success: false,
      error: `Unable to Login using email - ${email}`
    });
  }
};

export const checkAuth = async (req, res) => {
  const userEmail = req.user.emailId;
  const token = req.headers.authorization;
  const decoded = await jwt.verify(token, configkeys.secrets.JWT_SECRET);
  if (userEmail) {
    try {
      const userDetails = await getUserDetails(userEmail);

      if (Object.keys(userDetails).length > 0) {
        res.send({
          success: true,
          exp: (decoded && decoded.exp) || 0,
          loginDetails: userDetails,
          error: ""
        });
      } else {
        res.send({
          success: false,
          token: "",
          loginDetails: {},
          exp: (decoded && decoded.exp) || 0,
          error: { message: `Incorrect email ID : ${userEmail}` }
        });
      }
    } catch (e) {
      res.send({
        success: false,
        token: "",
        loginDetails: {},
        exp: (decoded && decoded.exp) || 0,
        error: { message: `Unable to Login using email - ${userEmail}` }
      });
    }
  } else {
    res.send({
      success: false,
      token: "",
      loginDetails: {},
      exp: (decoded && decoded.exp) || 0,
      error: { message: `Email ID doesn't exist - ${userEmail}` }
    });
  }
};

export const forgotPassword = async (req, res) => {
  let { emailId } = req.body;
  emailId = emailId.toLowerCase();
  const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!emailRegexp.test(emailId)) {
    return res.status(422).send({ success: false, message: "Invalid Email" });
  }

  const isEmailExist = await Users.findOne({
    emailId: emailId
  }).then(data => {
    return data ? true : false;
  });
  if (!isEmailExist) {
    return res
      .status(422)
      .send({ success: false, message: "email in not registered" });
  }
  const token = tokenForUser(req.body);
  const mailOptions = {
    to: emailId,
    from: process.env.MAILER_EMAIL_ID,
    subject: "Password help has arrived!",
    text:
    "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
    "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
    "https://ecarrenting.web.app/resetpassword?token=" +
    token +
    "\n\n" +
    "If you did not request this, please ignore this email and your password will remain unchanged.\n"
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

};

export const resetPassword = async (req, res) => {
  const data = req.body;
  try {
    const decoded = await jwt.verify(data.token, configkeys.secrets.JWT_SECRET);
    const password = bcrypt.hashSync(data.password);
    try {
      await Users.findOneAndUpdate(
        { emailId: decoded.emailId },
        { password: password }
      );
      return res.status(200).send({
        success: true,
        message: "your password changed successfully!"
      });
    } catch (err) {
      res.status(422).send({ success: false, message: err.message });
    }
  } catch (error) {
    res.status(422).send({ success: false, message: "unauthorized" });
  }
};

export const changePassword = async (req, res) => {
  const token = req.headers.authorization;
  console.log(req.body,token)
  try {
    const decoded = await jwt.verify(token, configkeys.secrets.JWT_SECRET);
    const password = bcrypt.hashSync(req.body.password);
    try {
      await Users.findOneAndUpdate(
        { emailId: decoded.emailId },
        { password: password }
      );
      return res.status(200).send({
        success: true,
        message: "your password changed successfully!"
      });
    } catch (err) {
      res.status(422).send({ success: false, message: err.message });
    }
  } catch (error) {
    res.status(422).send({ success: false, message: "unauthorized" });
  }
};

export const signupConfirm = async (req, res) => {
  const token = req.query.token;
  try {
    const decoded = await jwt.verify(token, configkeys.secrets.JWT_SECRET);
    //console.log("DECODED TOKEN", JSON.stringify(decoded, null, 2));
    try {
      await Users.findOneAndUpdate(
        { emailId: decoded.email },
        { onboardingStatus: "active" }
      );
      return res.redirect("http://localhost:3000/emailverify", 302);
    } catch (err) {
      res.status(422).send({ success: false, message: err.message });
    }
  } catch (error) {
    res.status(422).send({ success: false, message: "unauthorized" });
  }
};

export const setUserStatus = async (req, res) => {
  const { email, status } = req.body;
  try {
    //const decoded = await jwt.verify(token, configkeys.secrets.JWT_SECRET);
    try {
      await Users.findOneAndUpdate(
        { emailId: email },
        { onboardingStatus: status }
      );
      return res.status(200).send({
        success: true,
        message: "account is now " + status
      });
    } catch (err) {
      res.status(422).send({ success: false, message: err.message });
      res.status(422).send({ success: false, message: "unauthorized" });
    }
  } catch (err) {
    res.status(422).send({ success: false, message: "unautorized" });
  }
};
