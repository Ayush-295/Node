const express = require("express");
const mongoose = require("mongoose");
const userRouter=require('./routes/User');
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");

//Connection with mongoDB

connectMongoDb("mongodb://127.0.0.1:27017/mongo-app-1");



//Model



const app = express();
const port = 3000;

// Middleware-Plugin
app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));


app.use('/user',userRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
