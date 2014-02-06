var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');
var moment = require('moment');

console.log("Calling 'API'...");
rekwest({url:'http://api.bluebuttonconnector.org/providers?detailed=1', json:true}, function(err, response, data) {
  if (data && data.results) {
    console.log("Building list for " + data.results.length + " providers...");

    var insPros = [];
    var phyPros = [];
    var phaPros = [];
    var immPros = [];
    // var stateList = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // for (var i=0; i<stateList.length; i++) {
    //   immPros.push({name:stateList[i], bburl:'#', features:''});
    // }
      //- console.log(data.results);

    var numProviders = data.results.length;
    for (var i=0; i<numProviders; i++) {
      var pro = data.results[i];
      if (/insurance/i.test(pro.category)) {
        insPros.push(pro);
      } else if (/hospital|physician|provider/i.test(pro.category)) {
        phyPros.push(pro);
      } else if (/lab|pharmacy/i.test(pro.category)) {
        phaPros.push(pro);
      } else if (/immunization/i.test(pro.category)) {
        immPros.push(pro);
      }
    }

    var html = {};

    html.insurance = buildList('insurance' , insPros, 'Blue Cross');
    html.physician = buildList('physician' , phyPros, 'Anderson');
    html.pharmacy = buildList('pharmacy' , phaPros, 'Walgreens');
    html.immunization = buildList('immunization' , immPros, 'Arizona');

    var finalHtml = jade.renderFile('src/jade/templates/_findrecords.jade', {pretty: true, html:html});
    fs.writeFileSync('public/findrecords.html', finalHtml);
    console.log("DONE.");
    process.exit(0);

  } else {
    console.warn("PROBLEM CONNECTING TO API!");
    console.log("Error: ", err);
    console.log("Response: ", response);
    process.exit(1);
  }
});

function buildList(category, providerList, searchPlaceholder) {
  searchPlaceholder = searchPlaceholder || '';
  var unitedStates = [{data: "AK", label: "Alaska"},{data: "AL", label: "Alabama"},{data: "AR", label: "Arkansas"},{data: "AZ", label: "Arizona"},{data: "CA", label: "California"},{data: "CO", label: "Colorado"},{data: "CT", label: "Connecticut"},{data: "DE", label: "Delaware"},{data: "DC", label: "District of Columbia"},{data: "FL", label: "Florida"},{data: "GA", label: "Georgia"},{data: "HI", label: "Hawaii"},{data: "IA", label: "Iowa"},{data: "ID", label: "Idaho"},{data: "IL", label: "Illinois"},{data: "IN", label: "Indiana"},{data: "KS", label: "Kansas"},{data: "KY", label: "Kentucky"},{data: "LA", label: "Louisiana"},{data: "MA", label: "Massachusetts"},{data: "MD", label: "Maryland"},{data: "ME", label: "Maine"},{data: "MI", label: "Michigan"},{data: "MN", label: "Minnesota"},{data: "MS", label: "Mississippi"},{data: "MO", label: "Missouri"},{data: "MT", label: "Montana"},{data: "NC", label: "North Carolina"},{data: "ND", label: "North Dakota"},{data: "NE", label: "Nebraska"},{data: "NH", label: "New Hampshire"},{data: "NJ", label: "New Jersey"},{data: "NM", label: "New Mexico"},{data: "NV", label: "Nevada"},{data: "NY", label: "New York"},{data: "OH", label: "Ohio"},{data: "OK", label: "Oklahoma"},{data: "OR", label: "Oregon"},{data: "PA", label: "Pennsylvania"},{data: "RI", label: "Rhode Island"},{data: "SC", label: "South Carolina"},{data: "SD", label: "South Dakota"},{data: "TN", label: "Tennessee"},{data: "TX", label: "Texas"},{data: "UT", label: "Utah"},{data: "VA", label: "Virginia"},{data: "VT", label: "Vermont"},{data: "WA", label: "Washington"},{data: "WI", label: "Wisconsin"},{data: "WV", label: "West Virginia"},{data: "WY", label: "Wyoming"}];
  console.log("building " + category + " list for " + providerList.length + " providers...");
  var listhtml = jade.renderFile('src/jade/templates/_provider-list.jade', {pretty: true, providerList:providerList, category:category, searchPlaceholder:searchPlaceholder, unitedStates:unitedStates});

  providerList.forEach(function(prov, ind) {
    var toRender = prov;
    toRender.category = category;
    toRender.updated = moment(prov.updated).format("MMM Do, YYYY");

    toRender.bbview = false;
    if (prov.view.active_prescriptions || prov.view.allergies  || prov.view.appointment_history  || prov.view.claims || prov.view.clinical_notes || prov.view.diagnostics  || prov.view.family_history || prov.view.imaging  || prov.view.immunizations  || prov.view.lab_results  || prov.view.medical_history  || prov.view.medications  || prov.view.pathology  || prov.view.prescriptions  || prov.view.problems || prov.view.visit_history || prov.view.vitals) toRender.bbview = true;

    toRender.bbdownload = false;
    if (prov.download.text || prov.download.pdf || prov.download.c32 || prov.download.ccda || prov.download.other) toRender.bbdownload = true;

    toRender.bbtransmit = false;
    if (prov.transmit.automation || prov.transmit.direct.enabled || prov.transmit.direct.trust_bundles.patient || prov.transmit.direct.trust_bundles.provider  || prov.transmit.direct.trust_bundles.other || prov.transmit.rest.enabled || prov.transmit.rest.registries) toRender.transmit = true;

    toRender.bbautomatic = false;
    if (prov.transmit.automation) toRender.bbautomatic = true;

    toRender.additionalFeatures = false;
    if (prov.services.bill_pay || prov.services.caregiving || prov.services.dispute || prov.services.family_prescriptions || prov.services.new_prescriptions || prov.services.transfer_prescription || prov.services.refills || prov.services.automatic_refills || prov.services.test_request || prov.services.reminders || prov.services.scheduling || prov.services.search) toRender.additionalFeatures = true;

    toRender.pretty = true;
    var provHtml = jade.renderFile('src/jade/templates/_provider-profile.jade', toRender);
    fs.writeFileSync('public/providers/' + prov.id + '.html', provHtml);
    //check to see if image exists
    if (category != 'immunization') {
      try {
        var hasImg = fs.openSync('public/img/providers/'+prov.id+'.png', 'r');
      } catch (e) {
        console.warn("IMAGE NOT FOUND FOR " + prov.id);
      }
    }

  });

  return listhtml;
}
