import { Users } from "../api/users/users.model";

export const getMappedLoggedInUser = async email => {
  let returnObject;
  const regexemail = new RegExp(email, "i");
  try {
    returnObject = await Users.aggregate([
      {
        $match: {
          emailId: email.toLowerCase()
        }
      },
      {
        $project: {
          userId: "$_id",
          emailId: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1
        }
      }
    ]);
  } catch (err) {
    console.log("There is an error");
  }
  return returnObject[0];
};

export const getUserDetails = async email => {
  return await getMappedLoggedInUser(email);
};
