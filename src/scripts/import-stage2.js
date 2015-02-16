var fs = require('fs'),
    csv = require('fast-csv')

var HOSPITAL_FILE = __dirname + "/EH_ProvidersPaidByEHR_12_2014_FINAL.csv";
var PROVIDER_FILE = __dirname + "/EP_ProvidersPaidByEHR_12_2014_FINAL.csv";
var STAGE2_CSV_OUT = __dirname + "/../../public/data/stage2.csv";
var STAGE2_JSON_OUT = __dirname + "/../../public/data/stage2.json";

function renameProperties(data) {
  if (data['STAGE NUMBER'] == 'Stage 2') {
    var betterPropNames = {};
    if (typeof data['PROVIDER / ORG NAME'] !== "undefined") betterPropNames.name = data['PROVIDER / ORG NAME'];
    if (typeof data['PROVIDER NAME'] !== "undefined") betterPropNames.name = data['PROVIDER NAME'];
    betterPropNames.state = data['PROVIDER STATE'];
    betterPropNames.city = data['PROVIDER CITY'];
    betterPropNames.address = data['PROVIDER  ADDRESS']; //yes, that's a double space in there. Blame the original source CSV...
    betterPropNames.zip = data['PROVIDER ZIP 5 CD'];
    betterPropNames.phone = data['PROVIDER PHONE NUM'];
    betterPropNames.payment = data['CALC PAYMENT  AMT ($)'];
    betterPropNames.npi = data['PROVIDER NPI'];
    return betterPropNames;
  } else {
    return false;
  }
}

var csvDone = false;
var jsonDone = false;

var csvOut = csv.createWriteStream({headers: true});
var csvFileOutStream = fs.createWriteStream(STAGE2_CSV_OUT);
csvFileOutStream.on("finish", function(){
  console.log("CSV WRITE FINISHED");
  checkDone();
});
csvOut.pipe(csvFileOutStream);

var firstJSON = true;
var jsonFileOutStream = fs.createWriteStream(STAGE2_JSON_OUT);
jsonFileOutStream.on("finish", function(){
  console.log("JSON WRITE FINISHED");
  checkDone();
});

function parseProviderFile(filepath, cb) {  
  var counter = 0;
  var csvInStream = csv
    .parse({headers:true, trim: true, ignoreEmpty: true})
    .transform(renameProperties)
    .validate(function(data){
      return data !== false;
    })
    .on("data-invalid", function(data){
      //these are the non-Stage 2 listings. Ignore for now.
    })
    .on("data", function(data){
      // console.log(data);
      counter++;
      csvOut.write(data);
      if (firstJSON) {
        jsonFileOutStream.write('[\n' + JSON.stringify(data));
        firstJSON = false;
      } else {
        jsonFileOutStream.write(',\n' + JSON.stringify(data));
      }
    })
    .on("end", function(){
      console.log("TOTAL STAGE 2 ENTRIES: " + counter);    
      cb();      
    });
  var fileStream = fs.createReadStream(filepath);   
  fileStream.pipe(csvInStream);
}

function checkDone() {
  if (csvDone && jsonDone) process.exit(0);
}

console.log("PARSING HOSPITALS...");
parseProviderFile(HOSPITAL_FILE, function(){
  console.log("HOSPITALS DONE");
  console.log("PARSING PROVIDERS...");
  parseProviderFile(PROVIDER_FILE, function(){
    console.log("PROVIDERS DONE");
    console.log("--------------");
    console.log("DONE AND DONE");    
    csvOut.end();  
    jsonFileOutStream.end('\n]');  
  });
});
