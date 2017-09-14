var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Mongoose config
var movieSchema = new mongoose.Schema({
	title: String,
	raiting: Number,
	description: String,
	myraiting: Number,
	viewdate: Date,
	review: String
});
var Movie = mongoose.model("Movie", movieSchema);

// Routes

// INDEX
app.get("/", function(req, res){
	res.redirect("/movies");
});

app.get("/movies", function(req, res){
	res.render("index");
});

app.listen(3000, function(){
	console.log("Server is running");
})