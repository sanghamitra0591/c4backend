const express= require("express");
const { PostModel } = require("../models/post.model");

const postRouter= express.Router();



postRouter.get("/", async(req, res)=>{
    const query= req.query;
    try {
        if(query.device1 && query.device2){
            const data= await PostModel.find({userId: req.body.userId, $or: [{device:query.device1}, {device:query.device2}]});
            console.log(query, query.device1, query.device2);
            res.send(data);
        }else{
            const data= await PostModel.find({userId: req.body.userId, device: query.device});
            res.send(data);
        }
    } catch (error) {
        console.log(error);
        res.send({"msg": "Unable to fetch data"});
    }
})


postRouter.post("/add", async(req, res)=>{
    const data= req.body;
    try {
        const newdata= new PostModel(data);
        await newdata.save();
        res.send("Added new post");
    } catch (error) {
        console.log(error);
        res.send({"msg": "Unable to fetch data"});
    }
})

postRouter.patch("/update/:id", async(req, res)=>{
    try {
        const payload= req.body;
        const id= req.params.id;
        const post= await PostModel.find({"_id":id});
        const postid= post[0].userId;
        const reqid= req.body.userId;
        if(postid===reqid){
            await PostModel.findByIdAndUpdate({"_id":id}, payload);
            res.send("Updated the post");
        }else{
            res.send({"msg": "You are not Authorized"});
        }
    } catch (error) {
        console.log(error);
        res.send({"msg": "Unable to update data"});
    }
})


postRouter.delete("/delete/:id", async(req, res)=>{
    try {
        const id= req.params.id;
        const post= await PostModel.find({"_id":id});
        const postid= post[0].userId;
        const reqid= req.body.userId;
        if(postid===reqid){
            await PostModel.findByIdAndDelete({"_id":id});
            res.send("Deleted the post");
        }else{
            res.send({"msg": "You are not Authorized"});
        }
    } catch (error) {
        console.log(error);
        res.send({"msg": "Unable to delete data"});
    }
})


module.exports= {
    postRouter
}
