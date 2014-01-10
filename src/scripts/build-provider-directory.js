var rekwest = require('request');
var jade = require('jade');
var fs = require('fs');

console.log("Calling 'API'...");
rekwest({url:'https://script.google.com/macros/s/AKfycbyLS-LV_9Vi0KrCLPzQjdPCQVHvPh326ibr_VTkMTmOKlOiYIjM/exec', json:true}, function(err, response, data) {
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
  console.log("building " + category + " list for " + providerList.length + " providers...");
  var listhtml = jade.renderFile('src/jade/templates/_provider_list.jade', {pretty: true, providerList:providerList, category:category, searchPlaceholder:searchPlaceholder});

  providerList.forEach(function(prov, ind) {
    var toRender = {};
    toRender.organization = prov.organization;
    toRender.id = prov.id;
    toRender.category = prov.category;

    toRender.bburl = prov.url.login || '#';

    toRender.bblogo = false;
    if (prov.bb_logo) toRender.bblogo = true;

    toRender.bbview = false;
    if (prov.view.active_prescriptions || prov.view.allergies  || prov.view.appointment_history  || prov.view.claims || prov.view.clinical_notes || prov.view.diagnostics  || prov.view.family_history || prov.view.imaging  || prov.view.immunizations  || prov.view.lab_results  || prov.view.medical_history  || prov.view.medications  || prov.view.pathology  || prov.view.prescriptions  || prov.view.problems || prov.view.visit_history || prov.view.vitals) toRender.bbview = true;

    toRender.bbdownload = false;
    if (prov.download.text || prov.download.pdf || prov.download.c32 || prov.download.ccda || prov.download.other) toRender.bbdownload = true;

    toRender.bbtransmit = false;
    if (prov.transmit.automation || prov.transmit.direct.enabled || prov.transmit.direct.trust_bundles.patient || prov.transmit.direct.trust_bundles.provider  || prov.transmit.direct.trust_bundles.other || prov.transmit.rest.enabled || prov.transmit.rest.registries) toRender.transmit = true;

    toRender.bbautomatic = false;
    if (prov.transmit.automation) toRender.bbautomatic = true;

    toRender.description = prov.description || '';

    toRender.pretty = true;
    var provHtml = jade.renderFile('src/jade/templates/_companyprofile.jade', toRender);
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
