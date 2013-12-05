function provider_tpl(locals) {
var buf = [];
var locals_ = (locals || {}),name = locals_.name,bblogo = locals_.bblogo,bbview = locals_.bbview,bbdownload = locals_.bbdownload,bbsend = locals_.bbsend,bbupdate = locals_.bbupdate,bburl = locals_.bburl,profileimg = locals_.profileimg;var additionalFeatures = true //temp hack
buf.push("<h2 class=\"page-title\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</h2><div class=\"row\"><div class=\"col-sm-7 col-sm-push-5 col-xs-12\"><h3 class=\"sub-title\">Features</h3><ul class=\"feature-list list-unstyled\"><li class=\"clearfix\">");
if (bblogo)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>provider</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>provider doesn't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Displays Blue Button Logo on website</h6></li><li class=\"clearfix\">");
if (bbview)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>you can</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>you can't</em></span>");
}
buf.push("<h6 class=\"feature-title\">View your records online</h6></li><li class=\"clearfix\">");
if (bbdownload)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>you can</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>you can't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Download your records</h6></li><li class=\"clearfix\">");
if (bbsend)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>you can</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>you can't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Securely send your records to your preferred application</h6></li><li class=\"clearfix\">");
if (bbupdate)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>you can</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>you can't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Automatically receive updates to your health records</h6></li><li class=\"clearfix\">");
if (additionalFeatures)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>there are</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>there are no</em></span>");
}
buf.push("<h6 class=\"feature-title\">Additional features</h6>");
if (additionalFeatures)
{
buf.push("<ul class=\"additional-features-list\"><li>Pay your bills online</li><li>Manage your family's health</li><li>Act some other cool way</li><li>Be excited about our features</li></ul>");
}
buf.push("</li></ul><hr class=\"visible-xs\"/></div><div class=\"col-sm-5 col-sm-pull-7 col-xs-12 pt-5\"><a" + (jade.attrs({ 'href':(bburl), 'target':('_blank'), "class": [('get-records-wrapper-link')] }, {"href":true,"target":true})) + "><p class=\"fg-daqua\">www.aetna.com</p><img" + (jade.attrs({ 'src':('img/' + profileimg), "class": [('img-thumbnail'),('img-responsive'),('profile-img')] }, {"src":true})) + "/><div class=\"get-records-prep\"><h6 class=\"go-get-em-header fg-maqua text-center\">get your health records</h6><img src=\"img/arrow-up.png\" class=\"arrow-up hidden-xs\"/></div></a><h6 class=\"provider-about-header fs-xsmall fw-strong fg-dgrey\">About Aetna</h6><p class=\"provider-description\">We've been there for you in the past, providing health care for more than 60 years. We're here for you today and in days to come, with our ongoing commitment to quality. And we share this tradition and commitment by reaching out to your community, and promoting health and wellness for all.</p></div></div><div class=\"row\"><div class=\"col-sm-7 col-sm-push-5 col-xs-12\"><div class=\"ask-participate\"><h5 class=\"fw-normal fg-dblue\">Ask your organization to participate!</h5><h6 class=\"fg-mgrey\">If some features are not available, ask them why and request it now.</h6><a href=\"#\" class=\"btn btn-primary\">Request</a></div></div></div>");;return buf.join("");
}


function providerList_tpl(locals) {
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

buf.push("</ul><div class=\"tab-content col-md-8 col-sm-6\"><div class=\"tab-pane no-data active\"><h4>Don't see your organization or provider listed?</h4><h6>You may have a legal right under HIPAA to get your health records electronically.</h6><a href=\"mailto:bluebutton@hhs.gov?subject=Request+My+Data+From...&amp;body=Enter+the+name+of+your+provider+in+the+subject+line\" target=\"_blank\" class=\"not-listed-learn-more btn btn-lg btn-primary\">Request</a></div>");
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

buf.push("</ul><h6 class=\"fg-white\"><a href=\"companyprofile.html\" class=\"get-data-btn btn btn-large btn-info\">View Aetna's Profile</a></h6></div>");
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

buf.push("</ul><h6 class=\"fg-white\"><a href=\"companyprofile.html\" class=\"get-data-btn btn btn-large btn-info\">View Aetna's Profile</a></h6></div>");
    }

  }
}).call(this);

buf.push("</div>");;return buf.join("");
}

function receiverList_tpl(locals) {
var buf = [];
var locals_ = (locals || {}),receiverList = locals_.receiverList;// iterate receiverList
;(function(){
  var $$obj = receiverList;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var app = $$obj[$index];

buf.push("<li class=\"col-sm-4 app-rapper\"><a" + (jade.attrs({ 'href':(app.link), "class": [('text-center')] }, {"href":true})) + "><img" + (jade.attrs({ 'src':('img/apps/' + app.img), "class": [('app-icon')] }, {"src":true})) + "/></a><h5 class=\"fg-maqua\">" + (jade.escape(null == (jade.interp = app.name) ? "" : jade.interp)) + "</h5><div class=\"app-description\"><h6>" + (jade.escape(null == (jade.interp = app.description) ? "" : jade.interp)) + "</h6></div></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var app = $$obj[$index];

buf.push("<li class=\"col-sm-4 app-rapper\"><a" + (jade.attrs({ 'href':(app.link), "class": [('text-center')] }, {"href":true})) + "><img" + (jade.attrs({ 'src':('img/apps/' + app.img), "class": [('app-icon')] }, {"src":true})) + "/></a><h5 class=\"fg-maqua\">" + (jade.escape(null == (jade.interp = app.name) ? "" : jade.interp)) + "</h5><div class=\"app-description\"><h6>" + (jade.escape(null == (jade.interp = app.description) ? "" : jade.interp)) + "</h6></div></li>");
    }

  }
}).call(this);
;return buf.join("");
}
