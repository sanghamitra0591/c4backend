const express= require("express");
const { connection } = require("./configs/db");
const { Authentication } = require("./middlewares/Authentication.middleware");
const { postRouter } = require("./routes/post.route");
const { userRouter } = require("./routes/user.route");

const app= express();

app.use(express.json());

require("dotenv").config();

const cors= require("cors");

app.use(cors({
    origin: "*"
}))

app.get("/", (req, res)=>{
    res.send("Welcome to Home page");
})

app.use("/users", userRouter);


app.use(Authentication);

app.use("/posts", postRouter);



app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("Connected to DB")
    } catch (error) {
        console.log({"error":error});
    }
    console.log(`Running at port ${process.env.port}`);
})