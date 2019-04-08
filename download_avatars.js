var request = require('request');
var fs = require('fs');
var secret = require('./secrets')

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoArr, cb) {
  // Function that takes in user input arrays and runs callback function defined elsewhere
  var options = {
    url: 'https://api.github.com/repos/' + repoArr[0] + "/" + repoArr[1] + "/contributors",
    headers: {
      'User-Agent': 'request'
    },
    authorization: secret.GITHUB_TOKEN // authorization token saved in secret.js file
  };

  request(options, function(err, res, body) { //run request with options object
    cb(err, body);  // call back called with body response
  }); 

}

function downloadImageByURL (url, filepath) {
  // function that saves the image at specified url to given filepath
  request.get(url)
        .on('error', function(err) {
          throw err;
        })
        .on('response', function(response) {
          console.log("Downloading file.");          
        })
        .pipe(fs.createWriteStream(filepath))
        .on('finish', function() {
          console.log("Download complete!")
        });
}

getRepoContributors(getInput(), saveRepoContributors);


function saveRepoContributors(err, result) {
  // function that checks user inputs are valid for searching and calls downloadImageByURL in a for loop to download all files
  var data = JSON.parse(result);
  var fp = '';

  if (getInput().length !== 2) {
    console.log("Incorrect number of parameters passed. Please input exactly 2 values for repoOwner and repoName.")
  } else {
    for (var i = 0; i < data.length; i++) {
      fp = "avatars/" + data[i].login;
      downloadImageByURL(data[i].avatar_url, fp);
    }
  }
};

function getInput() {
  // function that reads user input, saves relevant information and return as an array
  var input = process.argv.slice(2);
  return input;
}