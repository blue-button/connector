var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');
var csv = require('fast-csv');
var async = require('async');
var lwip = require('lwip');

var leApps = [];
getEm();

function getEm() {
  console.log("Fetching CSV...");
  rekwest({url:'https://github.com/blue-button/connector/raw/master/public/data/apps.csv'}, function(err, response, body) {
    if (body && (err == null)) {
      csv
        .fromString(body, {headers: true})
        .transform(function(data){
          data.id = safeId(data.name);
          return data;
        })
        .on("data", function(data){
          leApps.push(data);
        })
        .on("end", function(){
          async.each(leApps, checkLogo, function(err){
            if (err) console.log("APP LOGO ERROR: ", err);
            console.log("Logo Checking Done.");
            buildEm(leApps);
          });
        });
    } else {
      console.warn("PROBLEM DOWNLOADING CSV!");
      process.exit(1);
    }
  });
}

// function getAppStoreReviews(apps, cb) {
//   console.log("Fetching app store reviews...");
//   var appleReviewsLeft = 0;
//   var googleReviewsLeft = 0;

//   apps.forEach(function(app) {
//     app.reviews = {apple: null, google: null};
//     if (app.apple_url) {
//       appleReviewsLeft ++;
//       getAppleReview(app, checkReviewsDone);
//     }
//     if (app.google_url) {
//       googleReviewsLeft ++
//       getGoogleReview(app, checkReviewsDone);
//     }
//   });

//   function getAppleReview(app, cb) {
//     var apple_id = false;
//     if(/\/id/.test(app.apple_url)) {
//       apple_id = app.apple_url.split("/id")[1].split('?')[0];
//     } else if (/\?id/.test(app.apple_url)) {
//       apple_id = app.apple_url.split("?id=")[1];
//     }
//     rekwest({url:'https://itunes.apple.com/lookup?id=' + apple_id, json:true}, function(err, response, body) {
//       if (err != null) {
//         console.log('ERROR RETRIEVING: https://itunes.apple.com/lookup?id=' + apple_id);
//         console.log(err);
//       }
//       else if (err == null && body.results && body.results.length > 0) {
//         var deets = body.results[0];
//         app.reviews.apple = {average: deets.averageUserRating || null, count: deets.userRatingCount || 0};
//       } else {
//         console.log("Hmmm... " + app.name, 'https://itunes.apple.com/lookup?id=' + apple_id, body);
//       }
//       appleReviewsLeft--;
//       cb();
//     });
//   }

//   function getGoogleReview(app, cb) {
//     var google_id = app.google_url.split("?id=")[1];
//     rekwest({url:'http://api.bluebuttonconnector.healthit.gov/googleplayreviews/' + google_id, json:true}, function(err, response, body) {
//       if (err != null) {
//         console.log('ERROR RETRIEVING: http://api.bluebuttonconnector.healthit.gov/googleplayreviews/' + google_id);
//         console.log(err);
//       }
//       if (err == null && body.count) {
//         app.reviews.google = body;
//       }
//       googleReviewsLeft--;
//       cb();
//     });
//   }

//   function checkReviewsDone() {
//     if (appleReviewsLeft == 0 && googleReviewsLeft == 0) cb(apps);
//   }
// }

function checkLogo(app, cb) {
  if ( !fs.existsSync(__dirname + '/../../public/img/apps/128-height/'+app.id+'.png') ) {
    console.warn("LOGO NOT FOUND FOR " + app.id);
    if (app.img && /^http/.test(app.img)) {
      console.log("...fetching: " + app.img);
      rekwest(app.img, {encoding: 'binary'}, function(error, response, body) {
        if (error) {
          console.log("ERROR FETCHING LOGO: ", error);
          return cb();
        }
        var ext = app.img.split(".").pop();
        var filepath = __dirname + '/../../public/img/apps/'+app.id+ '.' + ext;
        fs.writeFileSync(filepath, body, 'binary');
        fitLogo(filepath, app, cb);
      });
    } else {
      console.warn("ERROR: no existing logo file, but no link to fetch one either. :( ");
      cb();
    }
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
      console.log('...writing logo to' + __dirname + '/../../public/img/apps/128-height/'+app.id+'.png');
      image.writeFile(__dirname +'/../../public/img/apps/128-height/'+app.id+'.png', function(err){
        if (err) {
          console.log("lwip.writeFile error: ", err);
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

  var html = jade.renderFile(__dirname +'/../jade/templates/_apps.jade', {pretty: true, appList:apps});
  fs.writeFileSync(__dirname +'/../../public/apps/index.html', html);
  console.log("apps/index.html built.");

  buildDataDumpFiles(apps);
}

function buildDataDumpFiles(apps){
  console.log("Saving JSON file...");
  apps.forEach(function(app){
    delete app.id;
  });
  fs.writeFileSync(__dirname +'/../../public/data/apps.json', JSON.stringify(apps));
}

function trim(s) {
  if (typeof s === 'string') return s.trim();
  return s;
}

function safeId(s) {
  return trim(s).toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/\-+$/, '');
}
