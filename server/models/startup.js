import mongoose from "mongoose";

const StartUpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    state:{
        type:String,
        required:true,
    },
    sector:{
        type:String,
        required:true,
    },
    funding:{
        type:Number,
        default:0,
    },
    companytype:{
        type:String,
        default:"Private Limited",
    },
    registrationDate:{
        type:Date,
        default:Date.now,
    },
});

export default mongoose.model("Startup",StartUpSchema);