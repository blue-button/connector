var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var argv = require('minimist')(process.argv.slice(2));
var Pageres = require('pageres');
var lwip = require('lwip');

var leOrgs = [];
var initPathname = '/organizations?limit=100&detailed=1';
var missingScreenshots = [];

getEm(initPathname);

function getEm(pathname){
  console.log("Fetching " + pathname + "...");
  rekwest({url:'http://api.bluebuttonconnector.healthit.gov'+pathname, json:true}, function(err, response, body) {
    if (body && body.results) {
      leOrgs = leOrgs.concat(body.results);
      if (body.meta.next){
        getEm(body.meta.next);
      } else {
        buildEm(leOrgs);
      }
    } else {
      console.warn("PROBLEM CONNECTING TO API!");
      console.log("Error: ", err);
      process.exit(1);
    }
  });
}

function buildEm(orgs) {
  console.log("TOTAL ORGANIZATION COUNT: " + orgs.length);

  buildDataDumpFiles(orgs);

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
    if (/insurance/i.test(org.category)) {
      insOrgs.push(org);
    } else if (/hospital|physician|provider/i.test(org.category)) {
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
  html.provider = buildList({category:'provider', orgList: [], searchPlaceholder: 'Doe, Jane'});
  html.pharmacy = buildList({category:'pharmacy', orgList: phaOrgs, searchPlaceholder: 'Walgreens'});
  html.lab = buildList({category:'lab', orgList: labOrgs, searchPlaceholder: 'Quest Diagnostics'});
  html.immunization = buildList({category:'immunization', orgList: immOrgs, searchPlaceholder: 'Arizona'});
  html.hie = buildList({category:'hie', orgList: hieOrgs, searchPlaceholder: 'New Jersey'});

  var finalHtml = jade.renderFile('src/jade/templates/_organizations.jade', {pretty: true, html:html});
  fs.writeFileSync('public/records/index.html', finalHtml);
  handleMissingScreenshots(function(err){
    if (err) console.warn("PROBLEM with screenshots")
    console.log("DONE.");
    process.exit(0);
  });
}

function buildDataDumpFiles(orgs){
  console.log("Saving JSON file...");
  fs.writeFileSync('public/data/organizations.json', JSON.stringify(orgs));

  var toWrite = ''
  var flatFields = [];
  var sampleOrg = orgs[0];
  var eol = '\n';

  listProps(sampleOrg, '', flatFields);
  toWrite +=  '"' + flatFields.join('","') + '"';
  orgs.forEach(function(org) {
    if (org && Object.getOwnPropertyNames(org).length > 0) {
      var line = '';
      flatFields.forEach(function(prop) {
        var keyBits = prop.split('.');
        var evalable = "org";
        for (var i=0; i<keyBits.length; i++) {
          evalable+= '["' + keyBits[i] + '"]';
        }
        var evalHack = eval(evalable);
        if (typeof evalHack !== "undefined") {
          line += JSON.stringify(evalHack);
        }
        line += ',';
      });
      //remove last delimeter
      line = line.substring(0, line.length - 1);
      line = line.replace(/\\"/g, '""');
      toWrite += eol + line;
    }
  });


  fs.writeFileSync('public/data/organizations.csv', toWrite);

  function listProps(obj, prefix, flat) {
    for (var p in obj) {
      var propName = (prefix == '') ? p : prefix+"."+p;
      if (Object.prototype.toString.call(obj[p]) == "[object Object]") {
        listProps(obj[p], propName, flat);
      } else {
        flat.push(propName);
      }
    }
  }

}

function buildList(opt) {
  searchPlaceholder = searchPlaceholder || '';
  var category = opt.category;
  var orgList = opt.orgList;
  var searchPlaceholder = opt.searchPlaceholder;
  var unitedStates = [{data: "AK", label: "Alaska"},{data: "AL", label: "Alabama"},{data: "AR", label: "Arkansas"},{data: "AZ", label: "Arizona"},{data: "CA", label: "California"},{data: "CO", label: "Colorado"},{data: "CT", label: "Connecticut"},{data: "DE", label: "Delaware"},{data: "DC", label: "District of Columbia"},{data: "FL", label: "Florida"},{data: "GA", label: "Georgia"},{data: "HI", label: "Hawaii"},{data: "IA", label: "Iowa"},{data: "ID", label: "Idaho"},{data: "IL", label: "Illinois"},{data: "IN", label: "Indiana"},{data: "KS", label: "Kansas"},{data: "KY", label: "Kentucky"},{data: "LA", label: "Louisiana"},{data: "MA", label: "Massachusetts"},{data: "MD", label: "Maryland"},{data: "ME", label: "Maine"},{data: "MI", label: "Michigan"},{data: "MN", label: "Minnesota"},{data: "MS", label: "Mississippi"},{data: "MO", label: "Missouri"},{data: "MT", label: "Montana"},{data: "NC", label: "North Carolina"},{data: "ND", label: "North Dakota"},{data: "NE", label: "Nebraska"},{data: "NH", label: "New Hampshire"},{data: "NJ", label: "New Jersey"},{data: "NM", label: "New Mexico"},{data: "NV", label: "Nevada"},{data: "NY", label: "New York"},{data: "OH", label: "Ohio"},{data: "OK", label: "Oklahoma"},{data: "OR", label: "Oregon"},{data: "PA", label: "Pennsylvania"},{data: "RI", label: "Rhode Island"},{data: "SC", label: "South Carolina"},{data: "SD", label: "South Dakota"},{data: "TN", label: "Tennessee"},{data: "TX", label: "Texas"},{data: "UT", label: "Utah"},{data: "VA", label: "Virginia"},{data: "VT", label: "Vermont"},{data: "WA", label: "Washington"},{data: "WI", label: "Wisconsin"},{data: "WV", label: "West Virginia"},{data: "WY", label: "Wyoming"}];
  var listhtml = jade.renderFile('src/jade/templates/_organization-list.jade', {pretty: true, orgList:orgList, category:category, searchPlaceholder:searchPlaceholder, unitedStates:unitedStates});

  orgList.forEach(function(org, ind) {
    if (!org.id) {
      console.log("Missing ID for " + org.organization);
    }
    var toRender = org;
    toRender.category = category;
    toRender.updated = moment(org.updated).format("MMM Do, YYYY");

    toRender.bbview = false;
    if (org.view.active_prescriptions || org.view.allergies  || org.view.appointment_history  || org.view.claims || org.view.clinical_notes || org.view.diagnostics  || org.view.family_history || org.view.imaging  || org.view.immunizations  || org.view.lab_results  || org.view.medical_history  || org.view.medications  || org.view.pathology  || org.view.prescriptions  || org.view.problems || org.view.visit_history || org.view.vitals) toRender.bbview = true;

    toRender.bbdownload = false;
    if (org.download.text || org.download.pdf || org.download.c32 || org.download.ccda || org.download.other) toRender.bbdownload = true;

    toRender.bbtransmit = false;
    if (org.transmit.automation || org.transmit.direct.enabled || org.transmit.direct.trust_bundles.patient || org.transmit.direct.trust_bundles.provider  || org.transmit.direct.trust_bundles.other ) toRender.transmit = true;

    toRender.bbautomatic = false;
    if (org.transmit.automation) toRender.bbautomatic = true;

    toRender.additionalFeatures = false;
    if (org.services.bill_pay || org.services.caregiving || org.services.dispute || org.services.family_prescriptions || org.services.new_prescriptions || org.services.transfer_prescription || org.services.refills || org.services.automatic_refills || org.services.test_request || org.services.reminders || org.services.scheduling || org.services.search) toRender.additionalFeatures = true;

    toRender.pretty = true;
    var orgHtml = jade.renderFile('src/jade/templates/_organization-profile.jade', toRender);
    if (!fs.existsSync('public/organizations/' + org.id)) fs.mkdirSync('public/organizations/' + org.id);
    fs.writeFileSync('public/organizations/' + org.id + '/index.html', orgHtml);

    //check to see if image exists
    if (category !== 'hie' && !fs.existsSync('public/img/organizations/'+org.id+'.png')) {
      console.warn("IMAGE NOT FOUND FOR " + org.id);
      // queue it up for later processing, since we're living in sync land right now
      missingScreenshots.push({id: org.id, url: org.url.web || org.url.login});
    }

  });

  return listhtml;

}


function handleMissingScreenshots(cb) {
  if (missingScreenshots.length == 0) return cb(null);
  console.log("Fetching screenshots...", missingScreenshots);
  var pageres = new Pageres({delay: 3});
  missingScreenshots.forEach(function(ss){
    pageres.src(ss.url, ['1200x768'], {filename: ss.id, crop: true});
  });

  //temp directory for full-size screenshots:
  if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
  pageres.dest('tmp');
  pageres.run(function (err) {
    console.log('finished screenshots for: ', missingScreenshots);
    resizeScreenshots(cb, []);
  });

}

function resizeScreenshots(cb, errs) {
  if (missingScreenshots.length < 1) return cb();
  var errors = errs || [];
  var nextSS = missingScreenshots.pop();
  console.log("nextImage: " + nextSS.id);

  // oh async callbacks in a recursive function, you so crazy.
  lwip.open('tmp/'+nextSS.id+'.png', function(err, image){
    if (err) {
      errors.push(err);
      console.log("lwip.open error: ", err);
      resizeScreenshots(cb, errors);
    } else {
      image.scale(0.666666667, function(err, image){
        if (err) {
          errors.push(err);
          console.log("lwip.scale error: ", err);
          resizeScreenshots(cb, errors);
        } else {
          image.writeFile('public/img/organizations/'+nextSS.id+'.png', function(err){
            if (err) {
              errors.push(err);
              console.log("lwip.writeFile error: ", err);
            }
            resizeScreenshots(cb, errors);
          });
        }
      });
    }

  });
}
