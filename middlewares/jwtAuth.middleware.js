import jwt from "jsonwebtoken";
export const jwtAuth=(req,res,next)=>{
    // 1. Read the token 
// console.log(process.env.JWT_SECRET);
// console.log("jwt cookie-"+req.cookies.jwtToken);

let jwtToken=req.cookies.jwtToken;
    //2. if no token, return the error
if(jwtToken===undefined){
    return res.status(401).send('You are unauthorized! Please login or register to continue!');
}
    //3. check if token is valid
     //if valid, call next middleware
    //else, return error
try {
    // console.log("try-"+jwtToken);
    const payload=jwt.verify(jwtToken,process.env.JWT_SECRET);
// console.log(payload);
req.userId=payload.userId;
req.user=payload.user;
} catch (error) {   //errors can be caused by invalid token or token expiration or token modification
    // console.log(error);
    return res.status(401).send('You are unauthorized! Please login or register to continue!');

}
   next();
}
