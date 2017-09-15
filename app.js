var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var request = require("request");
var API_KEY = require("./config");

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
	image: String,
	description: String,
	myraiting: Number,
	review: String
});
var Movie = mongoose.model("Movie", movieSchema);

// Routes

// Re-route
app.get("/", function(req, res){
	res.redirect("/movies");
});

// INDEX
app.get("/movies", function(req, res){
	Movie.find({}, function(err, movies){
		if(err) {
			console.log("Error compiling index");
		} else {
			res.render("index", {movies: movies});
		}
	});
});
	// search result index

// SEARCH
app.get("/movies/search", function(req, res){
	res.render("search");
});

app.post("/movies/search", function(req, res){
	request("https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + "&query=" + req.body["search-movie"], function(err, response, body){
		if(err) {
			console.log("Error occured");
		} else {
			body = JSON.parse(body);
			res.render("results", {results: body.results});
		}
	})
});

// NEW
app.get("/movies/new", function(req, res){
	console.log(req.body);
	res.redirect("index");
});

// CREATE
app.post("/movies", function(req, res){
	Movie.create(req.body.movie, function(err, newMovie){
		if(err) {
			console.log("Error adding movie");
			res.redirect("/movies");
		} else {
			res.redirect("/movies");
		}
	});
});

// SHOW
app.get("/movies/results", function(req, res){
	res.redirect("/movies/search");
});
app.post("/movies/results", function(req, res){
	console.log(req.body);
	console.log(req.body.movie.id);
	request("https://api.themoviedb.org/3/movie/" + req.body.movie.id + "?api_key=" + API_KEY, function(err, response, body){
		body =JSON.parse(body);
		res.render("new", {movie: body});
	});
});


app.listen(3000, function(){

	console.log("Server is running");
})