const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  authID: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  newUser: {
    type: Boolean
  }
});

module.exports = User = mongoose.model("users", UserSchema);
