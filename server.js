/**
 * Created by alemjc on 2/22/16.
 */
var Sequelize = require("sequelize");
var express = require("express");
var expressHandlebars = require("express-handlebars");
//require("dotenv").config({path:"./DBCreds.env"});
var url = require("url");
var DBURL = url.format(process.env.CLEARDB_DATABASE_URL);
var PORT = process.env.PORT || 9001;

var app = express();

app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.use("/static", express.static("public"));

//routes
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

var sequelize = new Sequelize(process.env.DBURL,{pool: {
  max: 5,
  min: 0,
  idle: 1000
}});

var Places = sequelize.define("place", {
     address:{
       type:Sequelize.STRING,
       allowNull:false
     },

     pictures:{
       type:Sequelize.STRING
     },

     hours:{
       type:Sequelize.STRING
     },
     category:{
       type:Sequelize.STRING,
       allowNull:false
     }

 });

 var Users = sequelize.define("user",{
   firstName:{
     type:Sequelize.STRING,
     allowNull:false
   },
   lastName:{
     type:Sequelize.STRING,
     allowNull:false
   },

   userName:{
     type:Sequelize.STRING,
     allowNull:false,
     validate:{
       len:[5,20]
     }
   },

   password:{
     type:Sequelize.STRING,
     allowNull:false,
     validate:{
       len:[5,2000]
     }
   },

   birthday:{
     type:Sequelize.STRING
   }
 });

 var Ratings = sequelize.define("rating",{
   comment:{
     type:Sequelize.STRING
   }

 });

 Users.belongsToMany(Places,{through:Ratings});
 Places.belongsToMany(Users,{through:Ratings});


 sequelize.sync().then(function(){
   app.listen(PORT, function() {
     console.log("LISTENING ON %s", PORT);
   });

 }).catch(function(err){
    console.log("could not sync to db because of following error");
    console.log(err);

 });