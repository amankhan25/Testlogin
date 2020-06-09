require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passwordStrength = require('check-password-strength');
///////////////////////////////////////////////////////////////////////
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

///////////////////////////////////////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/testUserDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const userSchema = {
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

///////////////////////////////////////////////////////////////////////
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
///////////////////////////////////////////////////////////////////////
app.post("/register", function(req, res){
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.username,
    password: req.body.password,
  });


  var strength = passwordStrength(req.body.password).value;
  if(strength === "Strong"){
    newUser.save(function(err){

      if(!err){
          res.render("success");
      }else{
        console.log(err);
      }
    });
  }else{
    res.render("unsuccess");
  }

});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName}, function(err, foundUser){
    if(!err){
      if(foundUser.password === password){
        res.render("awesome",{usersCred:foundUser})
      }else{
        res.render("error");
      }
    }else{
      res.render("error");
    }
  })
});


app.listen(3000, function() {
  console.log("Server has started on port 3000");
});
