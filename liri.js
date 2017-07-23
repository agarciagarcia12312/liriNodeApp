var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var inputArray = process.argv;
var command = inputArray[2];

var searchName = "";
var spotifyName = "";

// function that fixes name for movie and spotify search
function fullName () {
	for (i=3; i< inputArray.length; i++) {
		if (i > 3) {
			spotifyName = spotifyName + " " + inputArray[i];
			searchName = searchName + "+" + inputArray[i]
		} else {
		spotifyName += inputArray[i];
		searchName += inputArray[i];
		}
	};
};

// function that decides what function to run depending on user 
function executeCommand () {
	if (command === "my-tweets") {
		tweetIt();
	} else if ( command === "spotify-this-song") {
		spotifyIt(spotifyName);

	} else if (command === "movie-this") {
		
		movieThis(searchName);

	} else if (command === "do-what-it-says") {
		readFS();
	}
}

// 1.) get the twitter api to pull the show last 20 twitterKeys
function tweetIt() {

	var client =  new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.tokenKey ,
	  access_token_secret: keys.twitterKeys.tokenSecret
	});



	var params = {screen_name: 'andygarciacodes'};
	client.get('statuses/user_timeline',  function(error, tweets, response) {
   		
   		for (i=0; i < 20; i++) { 
   			console.log("Tweet number" + (i+1) + ": " + tweets[i].text);
   		}	
});
}	

// tweetIt();

// 2.) get the spotify api to pull (artist, songName, linkToPreview, albulmName)

function spotifyIt(songName) {
	
 
	var spotify = new Spotify({
	  id: keys.spotifyKey.Client_ID, 
	  
	  secret: keys.spotifyKey.Client_Secret
	  
	});
	 
	spotify.search({ type: 'track', query: songName }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  } 
	console.log("Artist:  " + data.tracks.items[0].artists[0].name); 
	console.log("song name:  " + data.tracks.items[0].name); 
	console.log("link:  " + data.tracks.items[0].external_urls.spotify); 
	console.log("Album name:  " + data.tracks.items[0].album.name);


	});
}




// 3.) get the OMDB api to pull (movieTittle, year, imbdRating, 
// .........coutry, language, plot, actors, tomatoesUrl)

function movieThis(movieName) {
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
// This line is just to help us debug against the actual URL.

		
	request(queryUrl, function (error, responce, body) {

		if (!error && responce.statusCode === 200) {
			// console.log(JSON.parse(body).Released);

			// console.log(JSON.parse(body));
			console.log(JSON.parse(body).Title + " was releades on: " + JSON.parse(body).Released + ", with a IMBD-Rating of: " + JSON.parse(body).imdbRating);
			console.log("Originaly released in the: " + JSON.parse(body).Country + " in languages: " + JSON.parse(body).Language)
			console.log("plot: " + JSON.parse(body).Plot);
			console.log("Lead Actors: " + JSON.parse(body).Actors);
			console.log("Link to more Info: " + JSON.parse(body).Website);
		}
	});
}
// movieThis("fast");

// 4.) function that reads random.txt file and executes that command
function readFS () {
	fs.readFile('random.txt', "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}

		var dataArray = data.split(",");
		command = dataArray[0];
		searchName = dataArray[1];
		spotifyName = dataArray[1];
		executeCommand();

	});
}

// Initially runs the two functions that change the name and check to see which command to run
fullName();
executeCommand();