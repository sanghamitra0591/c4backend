const express= require("express");

const userRouter= express.Router();

const bcrypt= require("bcrypt");

const  jwt= require("jsonwebtoken");

const {UserModel}= require("../models/user.model");

userRouter.get("/", (req, res)=>{
    res.send("User Router");
})

userRouter.post("/register", async(req, res)=>{
    const {name, email, gender, password}= req.body;
    try {
        bcrypt.hash(password, 5, async(err, hashed)=>{
            if(err){
                console.log(err);
                res.send({"msg":"Something went wrong"});
            }else{
                const newdata= new UserModel({name, email, gender, password:hashed});
                await newdata.save();
                res.send("Registered");
            }
        })
    } catch (error) {
        console.log(error);
        res.send({"msg":"Something went wrong"});
    }
})

userRouter.post("/login", async(req, res)=>{
    const  {email, password}= req.body;
    try {
        const user= await UserModel.find({email});
        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result)=>{
                if(err){
                    res.send("Wrong Credentials.");
                }else{
                    const token= jwt.sign({userId:user[0]._id}, process.env.key);
                    res.send({"msg":"Login Successful", "token":token});
                }
            })
        }else{
            res.send({"msg":"No user found"});
        }
    } catch (error) {
        console.log(error);
        res.send({"msg":"Something went wrong"});
    }
})



module.exports= {
    userRouter
}