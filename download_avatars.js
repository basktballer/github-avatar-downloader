var request = require('request');
var fs = require('fs');
var secret = require('./secrets')

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoArr, cb) {
  // ...
  var options = {
    url: 'https://api.github.com/repos/' + repoArr[0] + "/" + repoArr[1] + "/contributors",
    headers: {
      'User-Agent': 'request'
    },
    authorization: secret.GITHUB_TOKEN
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });

}

function downloadImageByURL (url, filepath) {
  // ...
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

getRepoContributors(getInput(), function(err, result) {
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

});

function getInput() {
  var input = process.argv.slice(2);
  // console.log(input);
  return input;
  // return process.argv.slice(2);
}