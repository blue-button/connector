function anonymous(locals) {
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