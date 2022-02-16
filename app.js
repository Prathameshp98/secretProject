//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UserDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", function(req,res){

    User.findOne({email: req.body.username},function(err,foundItem){
        if(!err){
            if(foundItem){

                if(foundItem.password === md5(req.body.password)){
                    res.render("secrets");
                } else {
                    res.send("Incorrect username or passsword");
                }

            } else {
                res.send("NO such user");
            }
        } else {
            res.send(err);
        }
    });
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){

    const newUser = new User ({
        email: req.body.username,
        password: md5(req.body.password)
    }); 

    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        } else {
            res.send(err);
        }
    });

});

app.listen(process.env.PORT || 3000, function () {
    console.log("server is up and running.");
});