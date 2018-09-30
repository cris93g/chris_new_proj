require("dotenv").config()
const express = require("express")
const {json}= require("body-parser")
const cors = require("cors")
const app = express ()
const port = process.env.port || 3001;
const User = require("./mongo/Models/User")
const mongoose = require("mongoose");





//setting up mongo db database
const db= process.env.mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("mongoDB is ONLINE!"))
  .catch(err => console.log(err));


  //checking up on server
app.listen(port,()=>{
    console.log(`shit listening on port ${port}`)
})