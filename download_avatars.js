var request = require('request');
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

getRepoContributors("lighthouse-labs", "tweeter", function(err, result) {
  var data = JSON.parse(result);

  for (var i = 0; i < data.length; i++) {
    console.log("Avatar URL:", data[i].avatar_url);
  }
});