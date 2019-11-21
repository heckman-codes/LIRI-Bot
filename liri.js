require("dotenv").config();
var moment = require("moment");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api")
var fs = require("fs")
var queryType = process.argv[2]
var spotify = new Spotify(keys.spotify);
var searchQuery = process.argv;
var queryArr = [];

for (let i = 3; i < searchQuery.length; i++) {
    queryArr.push(searchQuery[i]);
}

var query = queryArr.join(" ");


if (query) {

    if (queryType == "concert-this") {
        concertThis();
    } else if (queryType == "spotify-this-song") {
        spotifyThis();
    } else if (queryType == "movie-this") {
        movieThis();
    } else {
        console.log("Please enter a valid search type:");
        console.log("'spotify-this-song' to search for a song");
        console.log("'movie-this' to search for a movie title");
        console.log("'concert-this' to find concerts for artists");
        console.log("'do-what-it-says' to search for whatever is on the random.txt file");
    }
} else if (!query) {
    if (queryType == "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                console.log(err)
            }

            dataArray = data.split(",");

            query = dataArray[1]

            switch (dataArray[0]) {
                case "concert-this": concertThis();
                    break;
                case "movie-this": movieThis();
                    break;
                case "spotify-this-song": spotifyThis();
                    break;
            }

        })
    } else {
        console.log("You need something to search for. Please enter literally anything after the query type.")
    }
}

function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp").then(function (response) {
        for (let j = 0; j < 5; j++) {
            console.log("\n—————— Result #" + (j + 1) + " ———————— \n");
            console.log("Venue: " + response.data[j].venue.name);
            console.log("Location: " + response.data[j].venue.city + ", " + response.data[j].venue.region + ", " + response.data[j].venue.country);
            console.log("Date: " + moment(response.data[j].datetime).format("LLLL") + "\n");

        }
    }).catch(function (err) {
        console.log(err)
    });
}

function spotifyThis() {
    spotify.search({
        type: 'track',
        query: query,
    }).then(function (response) {
        for (let i = 0; i < 5; i++) {
            console.log("\n—————— Result #" + (i + 1) + " ———————— \n");
            console.log("Artist: " + response.tracks.items[i].artists[0].name)
            console.log("Track name: " + response.tracks.items[i].name)
            console.log("Album: " + response.tracks.items[i].album.name)
            console.log("Spotify Link: " + response.tracks.items[i].external_urls.spotify + "\n")
        }
    }).catch(function (err) {
        console.log(err.response)
    })
}

function movieThis() {
    axios.get("http://www.omdbapi.com/?t=" + query + "&apikey=trilogy").then(function (response) {
        console.log("————————————————————————————————\n");
        console.log(response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Available Languages: " + response.data.Language);
        console.log("Actors: " + response.data.Actors + "\n\n");
    }).catch(function (err) {
        console.log(err.response)
    });
}