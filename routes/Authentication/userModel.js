import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide your Full Name!"],
    unique: [true, "Full Name Exist"],
  },

  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
});

const Users = mongoose.model("Users", UserSchema);

export default Users;
