Ractive.DEBUG = false;
var formType, rac, urlParams, apiUrl;
var apiBase = 'http://api.bluebuttonconnector.healthit.gov/';
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
    data: {
      _pageNum: 1,
      _pageCount: 5,
      _categories: ['provider', 'insurance', 'lab', 'pharmacy', 'immunization', 'hie'],
      _unitedStates: [{data: "AL", label: "Alabama"}, {data: "AK", label: "Alaska"},{data: "AZ", label: "Arizona"},{data: "AR", label: "Arkansas"},{data: "CA", label: "California"},{data: "CO", label: "Colorado"},{data: "CT", label: "Connecticut"},{data: "DE", label: "Delaware"},{data: "DC", label: "District of Columbia"},{data: "FL", label: "Florida"},{data: "GA", label: "Georgia"},{data: "HI", label: "Hawaii"},{data: "ID", label: "Idaho"},{data: "IL", label: "Illinois"},{data: "IN", label: "Indiana"},{data: "IA", label: "Iowa"},{data: "KS", label: "Kansas"},{data: "KY", label: "Kentucky"},{data: "LA", label: "Louisiana"},{data: "ME", label: "Maine"},{data: "MD", label: "Maryland"},{data: "MA", label: "Massachusetts"},{data: "MI", label: "Michigan"},{data: "MN", label: "Minnesota"},{data: "MS", label: "Mississippi"},{data: "MO", label: "Missouri"},{data: "MT", label: "Montana"},{data: "NE", label: "Nebraska"},{data: "NH", label: "New Hampshire"},{data: "NJ", label: "New Jersey"},{data: "NM", label: "New Mexico"},{data: "NV", label: "Nevada"},{data: "NY", label: "New York"},{data: "NC", label: "North Carolina"},{data: "ND", label: "North Dakota"},{data: "OH", label: "Ohio"},{data: "OK", label: "Oklahoma"},{data: "OR", label: "Oregon"},{data: "PA", label: "Pennsylvania"},{data: "RI", label: "Rhode Island"},{data: "SC", label: "South Carolina"},{data: "SD", label: "South Dakota"},{data: "TN", label: "Tennessee"},{data: "TX", label: "Texas"},{data: "UT", label: "Utah"},{data: "VT", label: "Vermont"},{data: "VA", label: "Virginia"},{data: "WA", label: "Washington"},{data: "WV", label: "West Virginia"},{data: "WI", label: "Wisconsin"},{data: "WY", label: "Wyoming"}],
      "bb_logo": false,
      "category": "",
      "description": "",
      "download": {
        "text": false,
        "pdf": false,
        "c32": false,
        "ccda": false,
        "other": false
      },
      "organization": "",
      "people_reached": 0,
      "phone": "",
      "services": {
        "refills": false,
        "automatic_refills": false,
        "transfer_prescriptions": false,
        "bill_pay": false,
        "caregiving": false,
        "dispute": false,
        "family_prescriptions": false,
        "new_prescriptions": false,
        "open_notes": false,
        "reminders": false,
        "scheduling": false,
        "search": false,
        "secure_messaging": false,
        "self_entered": false,
        "shop": false,
        "test_request": false,
        "email_alerts": false
      },
      "states": [],
      "transmit": {
        "direct": {
          "enabled": false,
          "trust_bundles": {
            "patient": false,
            "provider": false,
            "other": false
          }
        }
      },
      "url": {
        "login": "",
        "logo": "",
        "mobile": "",
        "screenshot": "",
        "web": ""
      },
      "view": {
        "active_prescriptions": false,
        "allergies": false,
        "appointment_history": false,
        "claims": false,
        "diagnostics": false,
        "family_history": false,
        "imaging": false,
        "immunizations": false,
        "lab_results": false,
        "medical_history": false,
        "medications": false,
        "pathology": false,
        "prescriptions": false,
        "problems": false,
        "visit_history": false,
        "vitals": false
      }
    },
    computed: {
      formReady: '${email} && ${organization} && ${description} && ${category} && ${url.login}'
    }
  });

  orgRac.on('_goto', function(evt, pg) {
    this.set('_pageNum', pg);
  });

  orgRac.on('submitForm', function(evt) {
    if (this.get('formReady')) {
      saveForm(pojo(this.get()));
    }
  });
  rac = orgRac;
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