var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');

console.log("Calling 'API'...");
rekwest({url:'https://script.google.com/macros/s/AKfycbyLS-LV_9Vi0KrCLPzQjdPCQVHvPh326ibr_VTkMTmOKlOiYIjM/exec?format=json&list=receivers', json:true}, function(err, response, body) {
  if (body && body.results) {
    console.log("Building pages for " + body.results.length + " apps...");
    // console.log(body.results);
    var pg = 0;
    var pgSize = 6;
    var apps = body.results;
    var numApps = apps.length;
    var batches = [];

    for (var i = 0; i < numApps ; i++) {
      if (i%pgSize === 0) {
        pg ++;
        batches.push(apps.slice((pg-1)*pgSize,pg*pgSize));
      }
    }

    for (var j = 0; j<batches.length; j++) {
      var curBatch = batches[j];
      var html = jade.renderFile('src/jade/templates/_userecords.jade', {pretty: true, receiverList:curBatch, page: j+1, totalPages:batches.length});
      fs.writeFileSync('public/userecords-' + (j+1) + '.html', html);
      console.log("userecords-" + (j+1) + " built.");
    }

    console.log("DONE.");
    process.exit(0);

  } else {
    console.warn("PROBLEM CONNECTING TO API!");
    process.exit(1);
  }
});
