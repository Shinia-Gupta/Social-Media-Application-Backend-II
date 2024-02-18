import winston from "winston";

const logger=winston.createLogger({
    level:'info',
    format:winston.format.json(),
    defaultMeta:{service:"User-service"},
    transports:[
        new winston.transports.File({filename:'blogs.log'})
    ]
})

const loggerMiddleware=(req,res,next)=>{
    if(!req.url.includes("signin")){
        const logData = `${req.url} - ${JSON.stringify(req.body)}`;
        logger.info(logData); 
       }
       next();
}

export default loggerMiddleware;