
import jwt from "jsonwebtoken";
import { UserRepository } from "./user.repository.js";
import { ApplicationError } from "../../error_handler/customErrorHandler.js";
import {  getOtp } from "../../utils/otpGenerator.js";
import { hashPassword } from "../../utils/hashPassword.js";


export class UserController {
  constructor() {
    this.userRepo = new UserRepository();
  }

  // User registration
  async registerUser(req, res, next) {
    let { password } = req.body;
    password = await hashPassword(password);
    const resp = await this.userRepo.register({ ...req.body, password });
    if (resp.success) {
      res.status(201).json({
        success: true,
        message: "User registration successful",
        registered_user: resp.res,
      });
    } else {
      next(new ApplicationError(500, "database error"));
    }
  }

  // User login
  async loginUser(req, res, next) {
    // console.log(req.headers);
    const resp = await this.userRepo.login(req.body);
    if (resp.success) {
      const token = jwt.sign(
        { _id: resp.res._id, user: resp.res },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );
      // const tokenAdded=  await this.userRepo.updateUserLogins(token,resp.res._id);
      // if(tokenAdded.success){
      //     console.log(`token added successfully to ${resp.res._id}`);
      // }else{
      //     console.log(`token add error to ${resp.res._id}`);

      // }
      res
        .cookie("jwtToken", token, {
          maxAge: 1 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .json({
          success: true,
          msg: "User logged in successfully",
          token: token,
        });
    } else {
      next(new ApplicationError(resp.error.statusCode, resp.error.message));
    }
  }

  // User logout
  async logoutUser(req, res, next) {
    res
      .clearCookie("jwtToken")
      .json({ success: true, msg: "Logged out successfully" });
  }

  // Logout user from all devices
  // async logoutAllDevices(req, res, next) {

  //       try {
  //           const userId = req._id;
  //         const logout= await this.userRepo.logoutAll(userId);
  //           res.status(200).json({success:true,msg:`Logged out from all devices successfully with logout info- ${logout}`});
  //       } catch (error) {
  //           console.error(error);
  //           res.status(500).send("Internal Server Error");
  //       }

  // }

  // Get user details by user ID
  async getUserDetails(req, res, next) {
    const resp = await this.userRepo.getById(req.params.userId);
    if (resp.success) {
      res.status(200).json({ success: true, user: resp.res });
    } else {
      next(new ApplicationError(resp.error.statusCode, resp.error.message));
    }
  }

  // Get details of all users
  async getAllUserDetails(req, res, next) {
    const resp = await this.userRepo.getAll();
    if (resp.success) {
      res.status(200).json({ success: true, users: resp.res });
    } else {
      next(new ApplicationError(resp.error.statusCode, resp.error.message));
    }
  }

  // Update user details by user ID
  async updateUserDetails(req, res, next) {
    try {
      console.log(req.user);
      if (req.params.userId == req.user._id) {
        console.log(req.body);
        const userData = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
        };
        const resp = await this.userRepo.updateDetails(
          userData,
          req.params.userId
        );
        if (resp.success) {
          res.status(200).json({ success: true, updated_user: resp.res });
        }
      } else {
        res.status(401).json({
          success: false,
          error: {
            statusCode: 401,
            message: "You are not authorized to update other user's details. ",
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
  //when user cals the reset password, an otp should be sent first, then route for verify should be directed and then reset password should be given access to the user
  async getOtpForUser(req, res, next) {
    try {
      const resp = await this.userRepo.sendResetOtp("shiniag2000@gmail.com");
      if (resp.success) {
        // await this.userRepo.verifyOtp(req.body);
        const otp = getOtp();
        res
          .cookie("otp", otp, { maxAge: 5 * 60 * 1000, httpOnly: true })
          .json({ success: true, otp_action: resp.res });
      } else {
        res.status(401).json({
          success: false,
          error: { statusCode: 401, message: "Email could not be sent. " },
        });
      }
      // mailSent('shiniag2000@gmail.com');
      // console.log(otp);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
  async verifyOtpForUser(req, res, next) {
    try {
      const resp = await this.userRepo.verifyOtp(req.body.otp,req.cookies.otp);
      if (resp.success) {
        res.status(200).json({ success: true, otp_verified: resp.res });
      } else {
        return res
          .status(200)
          .json({
            success: false,
            message: resp.res || "Internal Server Error",
          });
      }
      // mailSent('shiniag2000@gmail.com');
      // console.log(otp);
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: error.message || "Internal Server Error",
        });
    }
  }

  async resetPassword(req,res,next){
    try {
      let { password } = req.body;
      if(!password){
        return res
          .status(400)
          .json({
            success: false,
            message: "Password cannot be empty",
          });
      }
    password = await hashPassword(password);
      const resp=await this.userRepo.updatePassword(password,req.user._id);
      if (resp.success) {
        res.status(200).json({ success: true, password_updated: resp.res });
      } else {
        return res
          .status(200)
          .json({
            success: false,
            message: resp.res,
          });
      }
      // mailSent('shiniag2000@gmail.com');
      // console.log(otp);
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: error.message || "Internal Server Error",
        });
    }
  }
}
