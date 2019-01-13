require("dotenv").config();

var moment = require('moment');
var Spotify = require("node-spotify-api");
// var spotify = new Spotify({
//     id: "763c52880f2f40ac92023d38eb8236bb",
//     secret: "5f8a83316fdb4359b8d9157f87975eae"
//   });


var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var axios = require("axios");

var input = process.argv;

var commandText = process.argv[2]
if (input.length > 3) {
    for(i=3; i<input.length; i++) {
    commandText = commandText.concat(" ", input[i]);
    }
}



var input1 = "";
var input2 = "";


function commandConcert(queryItem) {
    axios.get("https://rest.bandsintown.com/artists/" + queryItem + "/events?app_id=codingbootcamp")
        .then(function(response){
            for (i=0; i<response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name)
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region)
                console.log("Date: " + moment(response.data[i].datetime.substring(0,10)).format("MM/DD/YYYY"))
                console.log("---------------------------------")
            
            }
        })
}

function commandSpotify(queryItem) {
    spotify.search({ type: "track", query: queryItem}, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
    
        console.log("---------------------------------"); 
        console.log("Song: " + data.tracks.items[0].name); 
        console.log("Artist: " + data.tracks.items[0].artists[0].name); 
        console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify); 
        console.log("Album: " + data.tracks.items[0].album.name); 
        console.log("---------------------------------"); 

    });
}

function commandMovie(queryItem) {
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t="+ queryItem)
    .then(function(response){
        // console.log(response.data)
        console.log("-------------------------------")
        console.log("Title: " + response.data.Title)
        console.log("Year: " + response.data.Year)
        console.log("IMDB Rating: " + response.data.imdbRating)
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
        console.log("Country of Production: " + response.data.Country)
        console.log("Language: " + response.data.Language)
        console.log("Plot: " + response.data.Plot)
        console.log("Actors: " + response.data.Actors)
        console.log("---------------------------------"); 

    })
}

if (input.length<3) {
    console.log("Please type in valid queries: 1) concert-this + [Query], 2) spotify-this-song + [Query], 3) movie-this + [Query], or 4)do-what-it-says + [Query]")
}

else {
    input1 = input[2].toLowerCase();
    
    if (input1 === "concert-this"){
        if (input.length<4) {
            console.log("Please type in valid queries: concert-this + <Artist Name>")
        }
        
        else { 
            input2 = input[3]
            if (input.length > 4) {
                for(i=4; i<input.length; i++) {
                    input2 = input2.concat(" ", input[i]);
                }
            }
            commandConcert(input2)
        }
    }

    else if (input1 === "spotify-this-song"){
        if (input.length<4) {
            input2 = "The Sign Ace of Base";
        }
        
        else { 
            input2 = input[3]
            if (input.length > 4) {
                for(i=4; i<input.length; i++) {
                    input2 = input2.concat(" ", input[i]);
                }
            }
        }
    
        commandSpotify(input2);
        
    }

    else if (input1 === "movie-this"){      
        if (input.length<4) {
            input2 = "Mr Nobody";
        }
        
        else { 
            input2 = input[3]
            if (input.length > 4) {
                for(i=4; i<input.length; i++) {
                    input2 = input2.concat(" ", input[i]);
                }
            }
        }

        commandMovie(input2)
        
    }

    else if (input1 === "do-what-it-says"){
        fs.readFile("random.txt", "utf8", function(err,data) {
            if (err) {
                console.log("This is an error reading the file..")
            }
            else {
                var randomText = data.split(",")
                var command = randomText[0].toLowerCase();
                var commandItem = randomText[1];
        
                if (command === "concert-this") {
                    commandConcert(commandItem)
                }

                else if (command === "spotify-this-song") {
                    commandSpotify(commandItem)
                }

                else if (command === "movie-this") {
                    commandMovie(commandItem)
                }
                
            }
        })
    }

    else {
        console.log("Please type in valid queries: 1) concert-this, 2) spotify-this-song, 3) movie-this, or 4)do-what-it-says")
    }

}


