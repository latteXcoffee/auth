require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
let ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.use(express.static("public"));

try {
  mongoose.connect('"mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("we're connected!");
  });
} catch (e) {
  console.log("could not connect");
};

// create new schema for DB
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/submit", function(req, res){
  res.render("submit");
});


app.post("/register", function(req, res) {

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets")
    }
  });

});


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets")
        }
      }
    }
  })
});





app.listen(3000, function(req, res) {
  console.log("Server is active on port 3000.")
});
