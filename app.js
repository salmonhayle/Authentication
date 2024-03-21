//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const  mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

console.log(process.env.SECRET);

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);


app.get("/", (req,res)=> {
  res.render("home");
});

app.get("/login", (req,res)=> {
  res.render("login");
});

app.post("/login", (req,res)=> {
  const userName = req.body.username;
  const password = req.body.password;
  async function checkEmail() {
    try {
      const result = await User.findOne({
        email: userName
      });
      console.log(result);
      if(result) {
        if(result.password === password) {
          res.render("secrets");
          console.log(result.password);
        }else {
          console.log("Wrong Password, Try Again");
        }
      }
    }catch(err) {
      console.log(err);
    }
  }
  checkEmail();
});

app.get("/register", (req,res)=> {
  res.render("register");
});

app.post("/register", (req,res)=> {
  async function checkRegister() {
    try {
      const newUser = new User ({
        email: req.body.username,
        password: req.body.password
      });
      newUser.save();
      res.render("secrets");
    }catch(err) {
      console.log(err);
    }
  }
  checkRegister();
});






app.listen(3000, ()=> {
  console.log("Server Started on port 3000");
});
