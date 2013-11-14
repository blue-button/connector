function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),name = locals_.name,bblogo = locals_.bblogo,bbview = locals_.bbview,bbdownload = locals_.bbdownload,bbsend = locals_.bbsend,bbupdate = locals_.bbupdate,bburl = locals_.bburl,profileimg = locals_.profileimg;buf.push("<h1 class=\"page-title\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</h1><div class=\"row\"><div class=\"col-sm-7 col-sm-push-5 col-xs-12\"><h3 class=\"sub-title\">Features</h3><ul class=\"feature-list list-unstyled\"><li class=\"clearfix\">");
if (bblogo)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>provider</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>provider doesn't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Uses Blue Button Logo on website</h6></li><li class=\"clearfix\">");
if (bbview)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>provider</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>provider doesn't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Enables you to view your records online</h6></li><li class=\"clearfix\">");
if (bbdownload)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>provider</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>provider doesn't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Enables you to download your records</h6></li><li class=\"clearfix\">");
if (bbsend)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>provider</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>provider doesn't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Enables you to securely send your records to your preferred application</h6></li><li class=\"clearfix\">");
if (bbupdate)
{
buf.push("<span class=\"fake-checkbox pull-left checked\"><em>provider</em></span>");
}
else
{
buf.push("<span class=\"fake-checkbox pull-left\"><em>provider doesn't</em></span>");
}
buf.push("<h6 class=\"feature-title\">Enables you to automatically receive updates to your health records</h6></li></ul></div><div class=\"col-sm-4 col-sm-pull-7 col-xs-12 pt-5\"><a" + (jade.attrs({ 'href':(bburl), 'target':('_blank') }, {"href":true,"target":true})) + "><p class=\"fg-daqua\">www.aetna.com</p><img" + (jade.attrs({ 'src':('img/' + profileimg), "class": [('img-thumbnail'),('img-responsive'),('profile-img')] }, {"src":true})) + "/></a><div class=\"get-records-prep hidden-xs\"><p class=\"fg-maqua\">After clicking here, you will be redirected to your organization's website where you can get your health records.</p><img src=\"img/arrow-up.png\" class=\"arrow-up\"/></div></div></div><div class=\"row\"><div class=\"col-sm-7 col-sm-push-5 col-xs-12\"><div class=\"ask-participate\"><h5 class=\"fw-normal fg-dblue\">Ask your organization to participate!</h5><h6 class=\"fg-mgrey\">If some features are not available, ask them why and request it now.</h6><a href=\"#\" class=\"btn btn-primary\">Request</a></div></div></div>");;return buf.join("");
}