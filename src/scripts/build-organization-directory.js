var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var csv = require('fast-csv');
var argv = require('minimist')(process.argv.slice(2));

var leOrgs = [];
var dataURL = 'https://raw.githubusercontent.com/blue-button/connector/master/public/data/organizations.csv';

getEm(dataURL);
function getEm(dataURL){
  console.log("Fetching " + dataURL + "...");
  rekwest({url:dataURL}, function(err, response, body) {
    if (body && (err == null)) {
      leOrgs = [];
      csv
        .fromString(body, {headers: true})
        .transform(function(data){
          data.view = (data.view == 'y') ? true : false;
          data.download = (data.download == 'y') ? true : false;
          data.transmit = (data.transmit == 'y') ? true : false;
          if (data.states == '') data.states = [];
          else data.states = data.states.split(",");
          return data;
        })
        .on("data", function(data){
          leOrgs.push(data);
        })
        .on("end", function(){
          buildEm(leOrgs);
        });
    } else {
      console.warn("PROBLEM DOWNLOADING CSV!");
      console.log("Error: ", err);
      process.exit(1);
    }
  });
}

function buildEm(orgs) {
  console.log("TOTAL ORGANIZATION COUNT: " + orgs.length);

  //buildDataDumpFiles(orgs);

  var insOrgs = [];
  var phyOrgs = [];
  var phaOrgs = [];
  var labOrgs = [];
  var immOrgs = [];
  var hieOrgs = [];
  // var stateList = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  // for (var i=0; i<stateList.length; i++) {
  //   immOrgs.push({name:stateList[i], bburl:'#', features:''});
  // }

  var numOrgs = orgs.length;
  for (var i=0; i<numOrgs; i++) {
    var org = orgs[i];
    org.id = safeId(org.organization);
    if (/insurance/i.test(org.category)) {
      insOrgs.push(org);
    } else if (/hospital|physician/i.test(org.category)) {
      phyOrgs.push(org);
    } else if (/lab/i.test(org.category)) {
      labOrgs.push(org);
    } else if (/pharmacy/i.test(org.category)) {
      phaOrgs.push(org);
    } else if (/immunization/i.test(org.category)) {
      immOrgs.push(org);
    } else if (/hie/i.test(org.category)) {
      hieOrgs.push(org);
    }
  }

  var html = {};

  html.insurance = buildList({category:'insurance', orgList: insOrgs, searchPlaceholder: 'Blue Cross'});
  html.physician = buildList({category:'physician', orgList: phyOrgs, searchPlaceholder: 'Mayo Clinic'});
  // html.provider = buildList({category:'provider', orgList: [], searchPlaceholder: 'Doe, Jane'});
  html.pharmacy = buildList({category:'pharmacy', orgList: phaOrgs, searchPlaceholder: 'Walgreens'});
  html.lab = buildList({category:'lab', orgList: labOrgs, searchPlaceholder: 'Quest Diagnostics'});
  html.immunization = buildList({category:'immunization', orgList: immOrgs, searchPlaceholder: 'Arizona'});
  html.hie = buildList({category:'hie', orgList: hieOrgs, searchPlaceholder: 'New Jersey'});

  var finalHtml = jade.renderFile(__dirname +'/../jade/templates/_organizations.jade', {pretty: true, html:html});
  fs.writeFileSync(__dirname +'/../../public/records/index.html', finalHtml);
}

function buildDataDumpFiles(orgs){
  console.log("Saving JSON file...");
  fs.writeFileSync(__dirname +'/../../public/data/organizations.json', JSON.stringify(orgs));
}

function buildList(opt) {
  searchPlaceholder = searchPlaceholder || '';
  var category = opt.category;
  var orgList = opt.orgList;
  var searchPlaceholder = opt.searchPlaceholder;
  var unitedStates = [{data: "AK", label: "Alaska"},{data: "AL", label: "Alabama"},{data: "AR", label: "Arkansas"},{data: "AZ", label: "Arizona"},{data: "CA", label: "California"},{data: "CO", label: "Colorado"},{data: "CT", label: "Connecticut"},{data: "DE", label: "Delaware"},{data: "DC", label: "District of Columbia"},{data: "FL", label: "Florida"},{data: "GA", label: "Georgia"},{data: "HI", label: "Hawaii"},{data: "IA", label: "Iowa"},{data: "ID", label: "Idaho"},{data: "IL", label: "Illinois"},{data: "IN", label: "Indiana"},{data: "KS", label: "Kansas"},{data: "KY", label: "Kentucky"},{data: "LA", label: "Louisiana"},{data: "MA", label: "Massachusetts"},{data: "MD", label: "Maryland"},{data: "ME", label: "Maine"},{data: "MI", label: "Michigan"},{data: "MN", label: "Minnesota"},{data: "MS", label: "Mississippi"},{data: "MO", label: "Missouri"},{data: "MT", label: "Montana"},{data: "NC", label: "North Carolina"},{data: "ND", label: "North Dakota"},{data: "NE", label: "Nebraska"},{data: "NH", label: "New Hampshire"},{data: "NJ", label: "New Jersey"},{data: "NM", label: "New Mexico"},{data: "NV", label: "Nevada"},{data: "NY", label: "New York"},{data: "OH", label: "Ohio"},{data: "OK", label: "Oklahoma"},{data: "OR", label: "Oregon"},{data: "PA", label: "Pennsylvania"},{data: "RI", label: "Rhode Island"},{data: "SC", label: "South Carolina"},{data: "SD", label: "South Dakota"},{data: "TN", label: "Tennessee"},{data: "TX", label: "Texas"},{data: "UT", label: "Utah"},{data: "VA", label: "Virginia"},{data: "VT", label: "Vermont"},{data: "WA", label: "Washington"},{data: "WI", label: "Wisconsin"},{data: "WV", label: "West Virginia"},{data: "WY", label: "Wyoming"}];
  var listhtml = jade.renderFile(__dirname +'/../jade/templates/_organization-list.jade', {pretty: true, orgList:orgList, category:category, searchPlaceholder:searchPlaceholder, unitedStates:unitedStates});

  console.log("Rendering HTML files for " + opt.category + "...");
  var buildCount = orgList.length;
  orgList.forEach(function(org, ind) {
    console.log(buildCount + " left");
    if (!org.id) {
      console.log("Missing ID for " + org.organization);
    }
    var toRender = org;
    toRender.category = category;
    // toRender.updated = moment(org.updated).format("MMM Do, YYYY");
    toRender.bbview = org.view;
    toRender.bbdownload = org.download;
    toRender.bbtransmit = org.transmit;

    toRender.pretty = true;
    var orgHtml = jade.renderFile(__dirname +'/../jade/templates/_organization-profile.jade', toRender);
    if (!fs.existsSync(__dirname +'/../../public/organizations/' + org.id)) fs.mkdirSync(__dirname +'/../../public/organizations/' + org.id);
    fs.writeFileSync(__dirname +'/../../public/organizations/' + org.id + '/index.html', orgHtml);

    //check to see if image exists
    if (!/followmyhealth/.test(org.url) && category !== 'hie' && !fs.existsSync(__dirname +'/../../public/img/organizations/'+org.id+'.png')) {
      console.warn("IMAGE NOT FOUND FOR " + org.id);
      // queue it up for later processing, since we're living in sync land right now
      // missingScreenshots.push({id: org.id, url: org.url || org.url.web || org.url.login});
    }
    buildCount--;
  });

  return listhtml;

}

function trim(s) {
  if (typeof s === 'string') return s.trim();
  return s;
}

function safeId(s) {
  return trim(s).toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/\-+$/, '');
}