import nodemailer from 'nodemailer';
import { generateOtp } from '../utils/otpGenerator.js';

const validOtp=generateOtp();
console.log('valid otp object=',validOtp);
const transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
        user: "codingninjas2k16@gmail.com",
    pass: "slwvvlczduktvhdj",
    },
  });

  export default function mailSent(email) {
    console.log("email : " , email);
    console.log(validOtp.otp);
    const sendOtp =  validOtp.otp;
    const mailOption = {
      from: "codingninjas2k16@gmail.com",
      to: email,
      subject: "OTP for reset password at Postaway",
      text: `Your otp is ${sendOtp}. The current Otp is valid for next 5 mins`,
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }