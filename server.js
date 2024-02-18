import app from "./index.js";
import connectToMongodb from "./src/config/mongooseConnect.js";
app.listen(8000,()=>{
    console.log('Server is listening at port 8000');
    connectToMongodb();
});