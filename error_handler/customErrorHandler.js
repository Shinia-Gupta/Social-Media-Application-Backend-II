
export class ApplicationError extends Error{
    constructor(statusCode,errorMsg){
        super(errorMsg);
        this.statusCode=statusCode;
    }
}