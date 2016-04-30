var fs = require('fs'),
    csv = require('fast-csv')

var HOSPITAL_FILE = __dirname + "/EH_ProvidersPaidByEHR_03_2016_FINAL.csv";
var PROVIDER_FILE_1 = __dirname + "/EP_ProvidersPaidByEHR_03_2016_FINAL_Part1.csv";
var PROVIDER_FILE_2 = __dirname + "/EP_ProvidersPaidByEHR_03_2016_FINAL_Part2.csv";
var STAGE2_CSV_OUT = __dirname + "/../../public/data/stage2.csv";
var STAGE2_JSON_OUT = __dirname + "/../../public/data/stage2.json";

function renameProperties(data) {
  if (data['STAGE NUMBER'] == 'Stage 2') {
    var betterPropNames = {};
    if (data['PROVIDER ZIP 5 CD'].length < 5) data['PROVIDER ZIP 5 CD'] = '0'+data['PROVIDER ZIP 5 CD']
    if (typeof data['PROVIDER / ORG NAME'] !== "undefined") betterPropNames.name = data['PROVIDER / ORG NAME'];
    if (typeof data['PROVIDER NAME'] !== "undefined") betterPropNames.name = data['PROVIDER NAME'];
    betterPropNames.state = stateAbbrev(data['PROVIDER STATE']);
    betterPropNames.city = data['PROVIDER CITY'];
    betterPropNames.address = data['PROVIDER  ADDRESS']; //yes, that's a double space in there. Blame the original source CSV...
    betterPropNames.zip = ''+data['PROVIDER ZIP 5 CD']; //don't let it auto-convert to a number, or we lose the first digit of the 0 zip codes.
    betterPropNames.phone = data['PROVIDER PHONE NUM'];
    betterPropNames.payment = numerize(data['CALC PAYMENT  AMT ($)']);
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

function stateAbbrev(st) {
  if (typeof st !== "string") return '';
  st = st.toLowerCase();
  var unitedStates = [{data: "AK", label: "Alaska"},{data: "AL", label: "Alabama"},{data: "AR", label: "Arkansas"},{data: "AZ", label: "Arizona"},{data: "CA", label: "California"},{data: "CO", label: "Colorado"},{data: "CT", label: "Connecticut"},{data: "DE", label: "Delaware"},{data: "DC", label: "District of Columbia"},{data: "FL", label: "Florida"},{data: "GA", label: "Georgia"},{data: "HI", label: "Hawaii"},{data: "IA", label: "Iowa"},{data: "ID", label: "Idaho"},{data: "IL", label: "Illinois"},{data: "IN", label: "Indiana"},{data: "KS", label: "Kansas"},{data: "KY", label: "Kentucky"},{data: "LA", label: "Louisiana"},{data: "MA", label: "Massachusetts"},{data: "MD", label: "Maryland"},{data: "ME", label: "Maine"},{data: "MI", label: "Michigan"},{data: "MN", label: "Minnesota"},{data: "MS", label: "Mississippi"},{data: "MO", label: "Missouri"},{data: "MT", label: "Montana"},{data: "NC", label: "North Carolina"},{data: "ND", label: "North Dakota"},{data: "NE", label: "Nebraska"},{data: "NH", label: "New Hampshire"},{data: "NJ", label: "New Jersey"},{data: "NM", label: "New Mexico"},{data: "NV", label: "Nevada"},{data: "NY", label: "New York"},{data: "OH", label: "Ohio"},{data: "OK", label: "Oklahoma"},{data: "OR", label: "Oregon"},{data: "PA", label: "Pennsylvania"},{data: "RI", label: "Rhode Island"},{data: "SC", label: "South Carolina"},{data: "SD", label: "South Dakota"},{data: "TN", label: "Tennessee"},{data: "TX", label: "Texas"},{data: "UT", label: "Utah"},{data: "VA", label: "Virginia"},{data: "VT", label: "Vermont"},{data: "WA", label: "Washington"},{data: "WI", label: "Wisconsin"},{data: "WV", label: "West Virginia"},{data: "WY", label: "Wyoming"}];
  var len = unitedStates.length;
  for (var i=0; i<len; i++) {
    if (unitedStates[i].label.toLowerCase() == st) return unitedStates[i].data;
  }
  return '';
}

function numerize(dollars) {
  return parseFloat(dollars.slice(1).replace(/,/g, ''));
}

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
  parseProviderFile(PROVIDER_FILE_1, function(){
    console.log("PROVIDERS PART 1 DONE");
    parseProviderFile(PROVIDER_FILE_2, function(){
      console.log("PROVIDERS PART 2 DONE");
      console.log("--------------");
      console.log("DONE AND DONE");
      csvOut.end();
      jsonFileOutStream.end('\n]');
    });
  });
});
