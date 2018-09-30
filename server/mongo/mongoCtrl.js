const mongoose = require("mongoose");
const User = require("./Models/User")


const db= process.env.mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("We found it, the rainbow connection!"))
  .catch(err => console.log(err));