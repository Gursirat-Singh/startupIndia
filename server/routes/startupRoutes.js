import express from "express";
import Startup from "../models/startup.js";

const router = express.Router();

router.post("/", async (req,res)=>{
    try{
        const newStartup = new Startup(req.body);
        const savedStartup = await newStartup.save();
        res.status(201).json(savedStartup);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get("/",async(req,res)=>{
    try{
        const startups = await Startup.find();
        res.json(startups);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

export default router;