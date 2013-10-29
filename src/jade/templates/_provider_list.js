function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),providerList = locals_.providerList,category = locals_.category;buf.push("<ul class=\"nav nav-pills nav-stacked col-md-4 col-sm-6 provider-list\">");
// iterate providerList
;(function(){
  var $$obj = providerList;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var provider = $$obj[$index];

var safeName = provider.name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
buf.push("<li><a" + (jade.attrs({ 'href':('#' + category + '-' + safeName), 'data-toggle':('tab') }, {"href":true,"data-toggle":true})) + ">" + (jade.escape((jade.interp = provider.name) == null ? '' : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var provider = $$obj[$index];

var safeName = provider.name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
buf.push("<li><a" + (jade.attrs({ 'href':('#' + category + '-' + safeName), 'data-toggle':('tab') }, {"href":true,"data-toggle":true})) + ">" + (jade.escape((jade.interp = provider.name) == null ? '' : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul><div class=\"tab-content col-md-8 col-sm-6\"><div class=\"tab-pane no-data active\"><h4>Don't see your organization or provider listed?</h4><h6>You may have a legal right under HIPAA to get your health records electronically.</h6><a href=\"#\" class=\"not-listed-learn-more btn btn-lg btn-primary\">Learn More</a></div>");
// iterate providerList
;(function(){
  var $$obj = providerList;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var provider = $$obj[$index];

var safeName = provider.name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
buf.push("<div" + (jade.attrs({ 'id':(category + '-' + safeName), "class": [('tab-pane'),('offerings')] }, {"id":true})) + "><h3 class=\"fg-white\">What you can expect</h3><hr class=\"white hairline\"/><ul class=\"dashed\">");
var featureList = provider.features.split(/[\n,?]+/);
// iterate featureList
;(function(){
  var $$obj = featureList;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var feature = $$obj[$index];

buf.push("<li class=\"h6 fg-white\">" + (jade.escape(null == (jade.interp = feature.replace(/^\s+|\s+$/g, '')) ? "" : jade.interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var feature = $$obj[$index];

buf.push("<li class=\"h6 fg-white\">" + (jade.escape(null == (jade.interp = feature.replace(/^\s+|\s+$/g, '')) ? "" : jade.interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul><h6 class=\"fg-white\"><a" + (jade.attrs({ 'href':(provider.bburl), 'target':("_blank"), "class": [('get-data-btn'),('btn'),('btn-large'),('btn-info')] }, {"href":true,"target":true})) + ">Get My Data</a><span class=\"or\">or</span><a href=\"companyprofile.html\" class=\"view-profile-btn fw-strong\">View Profile</a></h6></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var provider = $$obj[$index];

var safeName = provider.name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
buf.push("<div" + (jade.attrs({ 'id':(category + '-' + safeName), "class": [('tab-pane'),('offerings')] }, {"id":true})) + "><h3 class=\"fg-white\">What you can expect</h3><hr class=\"white hairline\"/><ul class=\"dashed\">");
var featureList = provider.features.split(/[\n,?]+/);
// iterate featureList
;(function(){
  var $$obj = featureList;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var feature = $$obj[$index];

buf.push("<li class=\"h6 fg-white\">" + (jade.escape(null == (jade.interp = feature.replace(/^\s+|\s+$/g, '')) ? "" : jade.interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var feature = $$obj[$index];

buf.push("<li class=\"h6 fg-white\">" + (jade.escape(null == (jade.interp = feature.replace(/^\s+|\s+$/g, '')) ? "" : jade.interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul><h6 class=\"fg-white\"><a" + (jade.attrs({ 'href':(provider.bburl), 'target':("_blank"), "class": [('get-data-btn'),('btn'),('btn-large'),('btn-info')] }, {"href":true,"target":true})) + ">Get My Data</a><span class=\"or\">or</span><a href=\"companyprofile.html\" class=\"view-profile-btn fw-strong\">View Profile</a></h6></div>");
    }

  }
}).call(this);

buf.push("</div>");;return buf.join("");
}