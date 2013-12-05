function anonymous(locals) {
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