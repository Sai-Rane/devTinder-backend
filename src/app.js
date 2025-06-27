const express = require("express");

const app = express(); //instance of express js application

//the below function is known as the request handler for "/"
app.use("/",(req,res)=>{
    res.send("hello from the dashboard")
})

//the below function is known as the request handler for "/test"
app.use("/test",(req,res)=>{
    console.log("test")
    res.send("test from the server")
})

//the below function is known as the request handler for "/hello"
app.use("/hello",(req,res)=>{
    res.send("hello hello")
})

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});