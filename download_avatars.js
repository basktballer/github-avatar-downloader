var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config();
var not200flag = false;


console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoArr, cb) {
  // Function that takes in user input arrays and runs callback function defined elsewhere
  var options = {
    url: 'https://api.github.com/repos/' + repoArr[0] + "/" + repoArr[1] + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN // authorization token saved in secret.js file
    }
  };

  request(options, function(err, res, body) { //run request with options object
    console.log('Status Code:',res.statusCode);
    if (res.statusCode !== 200) {
      not200flag = true;
    }
    
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
  var fp = 'avatars/';

  if (!fs.existsSync(fp)) { // if avatars directory doesn't exist, create it
    fs.mkdirSync(fp);
    console.log("avatars file path created.")
  }

  if (getInput().length !== 2) {
    console.log("Incorrect number of parameters passed. Please input exactly 2 values for repoOwner and repoName.")
  } else if (data.message === "Not Found") {
    console.log("Repo owner or repo name not found. Please check spelling and re-input.")
  } else if (not200flag === true) {
      console.log (data.message);
  } else {
    
    for (var i = 0; i < data.length; i++) {
      var path = fp + data[i].login;
      downloadImageByURL(data[i].avatar_url, path);
    }
  }
};

function getInput() {
  // function that reads user input, saves relevant information and return as an array
  var input = process.argv.slice(2);
  return input;
}