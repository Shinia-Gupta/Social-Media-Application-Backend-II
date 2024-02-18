import { generate } from "otp-generator";
let otp;
export const generateOtp = (expirationMinutes = 5) => {
  otp = generate(6, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  const expirationTime = new Date();
  console.log(expirationTime);
  expirationTime.setMinutes(expirationTime.getMinutes() + expirationMinutes);

  return { otp, expiresIn: expirationTime };
};

export const getOtp=()=>{
  return otp;
}