var formType, rac, urlParams, apiUrl;
var apiBase = 'http://localhost:5000/';
if (/app/.test(window.location.pathname)) {
  formType = 'app';
  apiUrl = apiBase + 'apps/';
  var appRac = new Ractive({
    template: '#app_tpl',
    el: 'app',
    data: {},
    computed: {
      formReady: '${email} && ${name} && ${description} && ${img} && ${organization} && ${url}'
    }
  });

  appRac.on('submitForm', function(evt) {
    if (this.get('formReady')) {
      saveForm(pojo(this.get()));
    }
  });
  rac = appRac;
} else if (/organization/.test(window.location.pathname)) {
  formType = 'org';
  apiUrl = apiBase + 'organizations/';
  var orgRac = new Ractive({
    template: '#org_tpl',
    el: 'org',
    data: {},
    computed: {
      formReady: 'true'
    }
  });

  orgRac.on('submitForm', function(evt) {
    if (this.get('formReady')) {
      saveForm(pojo(this.get()));
    }
  });
}

// prevent the default if they have JS enabled, we'll let Ractive handle this.
$( 'body' ).on('submit', '#app, #organization', function(evt) {
  evt.preventDefault();
});

(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

if (typeof urlParams.id === "undefined") {
  rac.set({});
} else {
  rac.set('_loading', true);
  $.ajax({
    url: apiUrl + urlParams.id,
    method: 'get',
    dataType: 'json',
    success: onGetExisting
  });
}

function onGetExisting(data) {
  rac.set('_loading', false);
  rac.set(data);
}

function saveForm(data) {
  rac.set('loading', true);
  $.ajax({
    url: apiUrl,
    method: 'post',
    dataType: 'json',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: onSaveSuccess,
    error: onSaveFail
  });
}

function onSaveSuccess(data) {
  // console.log("Saved!", data);
  rac.set('loading', false);
  if (data.success == true) {
    rac.set('_saved', true);
  } else {
    alert("There was a problem saving the data. Please try again later.")
  }
}

function onSaveFail(msg) {
  rac.set('loading', false);
  // console.log("ERROR SAVING: ", msg);
  alert("There was a problem saving the data. Please try again later.")
}

function pojo(obj) {
  var pj = {};
  for (var a in obj) {
    if (typeof obj[a] !== 'function' && (a == '_id' || !(/^_/.test(a)))) {
      pj[a] = obj[a];
    }
  }
  return pj;
}