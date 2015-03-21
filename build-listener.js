
var exec  = require('child_process').exec;
var config = require('nconf');
config.argv().env().file({ file: __dirname + './config.json' }).defaults({'PORT':5000});

var express = require('express');
var app = express();

app.get('/ping', function(req, res) {
  res.send("pong");
});

var leLog;
app.get('/build', function (req, res) {
  console.log('Building orgs...');
  exec('cd ' + config.get('MASTER_DIR') + '; git pull origin master; npm run build-organizations; npm run build-apps; git status;', function(error, stdout, stderr){
    if (/nothing to commit, working directory clean/.test(stdout)) {
      logIt("NOTHING TO DO HERE");
      res.send(leLog);
      leLog = '';
    } else {
      logIt('Committing changes to master branch...');
      exec('cd ' + config.get('GHPAGES_DIR') + '; git pull origin gh-pages; cd ' + config.get('MASTER_DIR') + '; grunt dist; git add --all; git commit -am "update data for one or more profiles"; git push origin master;', function(error, stdout, stderr){
        logIt(stdout);
        logIt('Committing changes to gh-pages branch...');
        exec('cd ' + config.get('GHPAGES_DIR') + '; git add --all; git commit -am "update data for one or more profiles"; git push origin gh-pages;', function(error, stdout, stderr){
          logIt(stdout);
          logIt("DONE");
          res.send(leLog);
          leLog = '';
        });
      });
    }
  });

});


function logIt(m) {
  console.log(m);
  leLog += m + '/n';
}

// FIRE IT UP
var server = app.listen(config.get('PORT'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('bluebuttonconnector web-builder listening at http://%s:%s', host, port);
});