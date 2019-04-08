var request = require('request');
var fs = require('fs');
var secret = require('./secrets')

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoOwner, repoName, cb) {
  // ...
  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + "/" + repoName + "/contributors",
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

getRepoContributors("lighthouse-labs", "tweeter", function(err, result) {
  var data = JSON.parse(result);
  var fp = '';

  for (var i = 0; i < data.length; i++) {
    fp = "avatars/" + data[i].login;
    downloadImageByURL(data[i].avatar_url, fp);
  }
});
