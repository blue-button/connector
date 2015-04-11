var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');
var json2csv = require('json2csv');
var async = require('async');

console.log("Calling 'API'...");
var leApps = [];
getEm('/apps?limit=100');

function getEm(pathname) {
  console.log("Fetching " + pathname + "...");
  rekwest({url:'http://api.bluebuttonconnector.healthit.gov' + pathname, json:true}, function(err, response, body) {
    if (body && body.results) {
      leApps = leApps.concat(body.results);
      if (body.meta.next) {
        getEm(body.meta.next);
      } else {
        getAppStoreReviews(leApps, function(apps){
          async.each(apps, checkLogo, function(err){
            if (err) console.log("APP LOGO ERROR: ", err);
            console.log("Logo Checking Done.");
            buildEm(apps);
          });
        });
      }
    } else {
      console.warn("PROBLEM CONNECTING TO API!");
      process.exit(1);
    }
  });
}

function getAppStoreReviews(apps, cb) {
  console.log("Fetching app store reviews...");
  var appleReviewsLeft = 0;
  var googleReviewsLeft = 0;

  apps.forEach(function(app) {
    app.reviews = {apple: null, google: null};
    if (app.apple_url) {
      appleReviewsLeft ++;
      getAppleReview(app, checkReviewsDone);
    }
    if (app.google_url) {
      googleReviewsLeft ++
      getGoogleReview(app, checkReviewsDone);
    }
  });

  function getAppleReview(app, cb) {
    var apple_id = app.apple_url.split("/id")[1].split('?')[0];
    rekwest({url:'https://itunes.apple.com/lookup?id=' + apple_id, json:true}, function(err, response, body) {
      if (err != null) {
        console.log('ERROR RETRIEVING: https://itunes.apple.com/lookup?id=' + apple_id);
        console.log(err);
      }
      else if (err == null && body.results && body.results.length > 0) {
        var deets = body.results[0];
        app.reviews.apple = {average: deets.averageUserRating || null, count: deets.userRatingCount || 0};
      } else {
        console.log("Hmmm... " + app.name, 'https://itunes.apple.com/lookup?id=' + apple_id, body);
      }
      appleReviewsLeft--;
      cb();
    });
  }

  function getGoogleReview(app, cb) {
    var google_id = app.google_url.split("?id=")[1];
    rekwest({url:'http://api.bluebuttonconnector.healthit.gov/googleplayreviews/' + google_id, json:true}, function(err, response, body) {
      if (err != null) {
        console.log('ERROR RETRIEVING: http://api.bluebuttonconnector.healthit.gov/googleplayreviews/' + google_id);
        console.log(err);
      }
      if (err == null && body.count) {
        app.reviews.google = body;
      }
      googleReviewsLeft--;
      cb();
    });
  }

  function checkReviewsDone() {
    if (appleReviewsLeft == 0 && googleReviewsLeft == 0) cb(apps);
  }
}

function checkLogo(app, cb) {
  console.log("checking: " + app.id);
  if (/^http/.test(app.img)) {
    console.log("...fetching: " + app.img);
    rekwest(app.img, {encoding: 'binary'}, function(error, response, body) {
      if (error) {
        console.log("ERROR FETCHING LOGO: ", error);
        return cb();
      }
      //temp directory
      if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
      var ext = app.img.split(".").pop();
      var filepath = 'tmp/'+app.id + '.' + ext;
      fs.writeFileSync(filepath, body, 'binary');
      fitLogo(filepath, app, cb);
    });
  } else {
    cb();
  }
};

function fitLogo(filepath, app, cb) {
  console.log("opening " + filepath);
  lwip.open(filepath, function(err, image){
    if (err) {
      console.log("lwip.open error: ", err);
      return cb();
    }
    console.log("...containing logo");
    image.contain(256, 128, {r: 0, g: 0, b: 0, a: 0}, function(err, image){
      if (err) {
        console.log("lwip.contain error: ", err);
        return cb();
      }
      console.log('...writing logo to public/img/apps/'+app.id+'.png');
      image.writeFile('public/img/apps/128-height/'+app.id+'.png', function(err){
        if (err) {
          console.log("lwip.writeFile error: ", err);
        } else {
          app.img = app.id + '.png';
        }
        cb();
      });
    });

  });
}

function buildEm(apps) {
  console.log("Building HTML files for " + apps.length + " apps...");
  var pg = 0;
  var numApps = apps.length;
  var batches = [apps];

  var html = jade.renderFile('src/jade/templates/_apps.jade', {pretty: true, appList:apps});
  fs.writeFileSync('public/apps/index.html', html);
  console.log("apps/index.html built.");

  buildDataDumpFiles(apps);
}

function buildDataDumpFiles(apps){
  console.log("Saving JSON file...");
  fs.writeFileSync('public/data/apps.json', JSON.stringify(apps));
  console.log("Saving CSV file...");
  //get the field name
  var csvFields = [];
  for (var prop in apps[0]) {
    csvFields.push(prop);
  }

  json2csv({data: apps, fields: csvFields}, function(err, csv) {
    if (err) console.log(err);
    fs.writeFileSync('public/data/apps.csv', csv);
    console.log("DONE.");
    process.exit(0);
  });
}
