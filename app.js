const express = require('express');
const app = express();
var favicon = require('serve-favicon');
var path = require('path');

const blogsRouter = require('./routes/router');
let errMsg1 = "";
let errMsg2 = "";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.urlencoded({extended:true}));

const mongoose = require('mongoose');
const dbURL = "mongodb+srv://blog_user:pass1234@cluster0.6dlr4ck.mongodb.net/blogs1?retryWrites=true&w=majority";
mongoose.connect(dbURL, { useNewUrlParser : true, useUnifiedTopology : true})
.then(() => {
    console.log("Database Connection Done");
    app.listen(8000);
}).catch((err) => {
    console.log(err);
})

const User = require('./model/user');

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.post("/login", async (req, res) => {
    try{
        const loginEmail = req.body.loginEmail;
        const loginPassword = req.body.loginPassword;
        
        const checkData = await User.findOne({ signupEmail : loginEmail });
        if (checkData.signupPassword == loginPassword){
            res.redirect("/blogs");
        }else{
            errMsg1 = "Invalid Login Details.";
            res.render("home", {errMsg1 : errMsg1});
        }

    }
    catch{
        errMsg1 = "Invalid Login Details.";
        res.render("home", {errMsg1 : errMsg1});
    }
    
})

app.post("/signup",  async (req, res) => {
    try{
        const user = new User({
            signupName : req.body.signupName,
            signupEmail : req.body.signupEmail,
            signupPassword : req.body.signupPassword
        })
        const signupEmail = req.body.signupEmail;
        const dataPresent = await User.findOne({ signupEmail : signupEmail });
        if (!dataPresent){
            await user.save();
            res.redirect("/blogs");
        }else{
            errMsg2 = "Email Id is registered already.";
            res.render("signup", {errMsg2 : errMsg2});
        }
    }
    catch{
        res.status(400).render("404");
    }
})

app.use("/blogs", blogsRouter);

app.use((req, res) => {
    res.status(404).render("404");
})



