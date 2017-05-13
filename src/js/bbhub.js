/*
  * To Title Case 2.1 – http://individed.com/code/to-title-case/
  * Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
 */

String.prototype.toTitleCase = function(){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

/* BlueButton Connector */

$(function() {
  $('a.next-btn').smoothScroll();
  var isMac = false;
  if (navigator.userAgent.indexOf('Mac OS X') != -1) {
    isMac = true;
  }
  var canPush = false;
  if (!!(window.history && history.pushState)) {
    canPush = true;

    // only place we're using XHR is for retrieving MU Stage2 listings.
    // TODO get smarter about handling provider types auto-selecting when using browser back-and-forth
    window.addEventListener("popstate", function(e) {
      var bits = window.location.hash.split("?");
    });
  }

  var showOrgList = function(el){
    $.smoothScroll({
      scrollTarget: '#select-provider-wrapper'
      // afterScroll: function(){ $('#select-provider-wrapper > .active .provider-search').focus(); }
    });
    if (isMac) {
      var $leList = $($(el).attr('href')).find('.provider-list');
      //TODO hie doesn't have provider-list yet. It will...
      if (!$leList.length) return;
      setTimeout(function(){
        if ($leList[0].clientHeight < $leList[0].scrollHeight) {
          $leList.next().find('.scroll-hint').removeClass('no-show');
        }
      }, 300)
    }
  }

  $('body').on('click', 'a.box-link-rapper', function(evt, wasTriggered) {
    if (canPush && !wasTriggered) {
      history.pushState(null, '', window.location.pathname + this.hash);
    }
    showOrgList(this);
  });

  $('body').on('click', 'a.provider-link', function(evt) {
    if (canPush) {
      var hashNoQuery = stripQueryFromHash(window.location.hash);
      var nameSearchInput = $(this).parents('.providers').find('.provider-search-name').val();
      if (nameSearchInput.length) {
        history.pushState(null, '', window.location.pathname + hashNoQuery + '?q=' + nameSearchInput);
      } else {
        var stateSearchInput = $(this).parents('.providers').find('.provider-search-state').val();
        if (stateSearchInput.length && stateSearchInput !== 'false') {
          history.pushState(null, '', window.location.pathname + hashNoQuery + '?state=' + stateSearchInput);
        }
      }
    }
  });

  //create the filter-able lists
  //TODO consider optimizing this to work with single instance
  var listOptions = {
    listClass: 'provider-list',
    searchClass: 'provider-search-name',
    valueNames: [ 'provider-link']
  };

  var catLists = {
    insuranceList: new List('insurance-list-wrapper', listOptions),
    physicianList: new List('physician-list-wrapper', listOptions),
    pharmacyList: new List('pharmacy-list-wrapper', listOptions),
    labList: new List('lab-list-wrapper', listOptions),
    immunizationList: new List('immunization-list-wrapper', listOptions)
  }

  //TODO bring this back once we replace the "coming soon" with actual HIE listings
  // var hieList = new List('hie-list-wrapper', listOptions);

  function clearStateSelection() {
    var $pvs = $('.provider-search-state');
    $pvs.each(function(){
      if ($(this).val() !== 'false') {
        $(this).val('false');
      }
    });

    for (var a in catLists) {
      catLists[a].filter();
    }
  }

  function clearMU2() {
    $('#provider .filter-by-last-name').addClass('hide');
    $('#provider .no-results').addClass('hide');
    $('#provider-list').html('');
    $('#provider .total-listings').removeClass('in');
  }

  function stripQueryFromHash(h) {
    var bits = h.split('?');
    return bits[0];
  }

  function parseQueryString(queryString) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
  };

  $('body').on('input keychange', '.provider-search-name', $.debounce(750, function(evt) {
    //when free text searching, clear out the state filter
    clearStateSelection();
    var $self = $(this);
    var selSource = $self.closest('.tab-pane').attr('id');
  }));

  $('body').on('input keychange', '.provider-search-zip', function(evt) {
    //when free text searching, clear out the state filter (which is only on physicianList)
    clearStateSelection();
    var zip = $(this).val();
    if (zip.length == 5) {
      $('#provider .provider-search-state').val('false');
    } else {
      clearMU2();
    }
  });

  $('body').on('change', '.provider-search-state', function(evt) {
    var $self = $(this);
    var selSource = $self.closest('.tab-pane').attr('id');
    var selState = $self.val();
      var selCatList = catLists[$self.closest('.tab-pane').attr('id') + 'List'];
      if (selState == 'false') {
        selCatList.filter();
        return false;
      }
      var filterByState = function(item) {
        var leStates = $(item.elm).find('a').attr('data-state').split(',');
        var sLen = leStates.length;
        var include = false;
        for (var i=0; i<sLen; i++) {
          if (selState === "all" || selState == leStates[i]) {
            include = true;
            break;
          }
        }
        return include;
      }

      $('#physician-list-wrapper .provider-search-name').val('');
      selCatList.search();
      selCatList.filter(filterByState);

    return false;
  });

  $('body').on('click', 'a.vid-still', function(evt) {
    var $self = $(this);
    var $vidmodal = $('#vid-modal');
    $('#vid-frame').data('yturl', '//www.youtube.com/embed/' + $self.data('ytid') + '?rel=0&theme=dark&modestbranding=0&color=white&controls=1&autohide=1&showinfo=0&hd=1&autoplay=1');
    $vidmodal.modal('show');
    evt.preventDefault();
    return false;
  });

  $('#vid-modal').on('hidden.bs.modal', function () {
    $('#vid-frame').attr('src', '')
    $('#vid-modal').find('.modal-title').html('');
  });

  $('#vid-modal').on('shown.bs.modal', function () {
    var $vidframe = $('#vid-frame');
    $vidframe.attr('src', $vidframe.data('yturl'));
  });

  // Mac users won't have a very good indication that the list of orgs is scrollable. Show the arrow if we need it.
  var determineShowScrollHint = function(pl) {
    var $scrollHint = pl.next().find('.scroll-hint');
    if (pl[0].scrollHeight - pl.scrollTop() < pl.outerHeight() + 30) {
      $scrollHint.addClass('no-show');
    } else {
      $scrollHint.removeClass('no-show');
    }
  }

  if (isMac) {
    var scrollTimer;
    $('.provider-list').scroll(function(evt) {
      var pl = $(this);
      if (scrollTimer) { clearTimeout(scrollTimer); }
      scrollTimer = setTimeout(function() {
        determineShowScrollHint(pl)
      }, 200);
    });
  }

  //check for fragment on records page
  if (window.location.pathname === '/records/' && window.location.hash.length) {
    var frags = window.location.hash.split('?');
    var $selCatLink = $('a.box-link-rapper[href=' + frags[0] + ']');
    $selCatLink.trigger('click', true);
    //now check to see if they've got a search

    if (frags.length > 1) {
      var params = parseQueryString(frags[1]);
      if (params.q && params.q !== '') {
        $($selCatLink.attr('href')+'-list-wrapper').find('.provider-search-name').val(params.q);
        catLists[$selCatLink.attr('href').substring(1)+'List'].search(params.q);
      } else if (params.state && params.state !== '') {
        $($selCatLink.attr('href')+'-list-wrapper').find('.provider-search-state').val(params.state).trigger('change');
      } else if (params.name && params.name !== '') { //this is the name search for muStage2 providers
        $('#provider-list-wrapper').find('.provider-search-name').val(decodeURIComponent(params.name)).trigger('keychange');
      }
    }
  }

  FastClick.attach(document.body);

});
