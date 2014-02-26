$(function() {
  $('a.next-btn').smoothScroll();
  var isMac = false;
  if (navigator.userAgent.indexOf('Mac OS X') != -1) {
    isMac = true;
  }
  var canPush = false;
  if (!!(window.history && history.pushState)) {
    canPush = true;
    $('body').on('click', '.app-pagination a', function(evt) {
      var link = $(this).attr('href');
      $.get(link, function(data) {
        var $data = $(data);
        var $appList = $('#app-list');
        var appHTML = $data.find('#app-list').html();
        var $appPagination = $('.app-pagination');
        var paginationHTML = $data.find('.app-pagination').html();
        $appList.html(appHTML);
        $appPagination.html(paginationHTML);
      });
      history.pushState(null, '', link);
      $.smoothScroll({
        scrollTarget: '#app-list'
      });
      evt.preventDefault();
      return false;
    });
  }

  $('body').on('click', 'a.box-link-rapper', function(evt) {
    $.smoothScroll({
      scrollTarget: '#select-provider-wrapper'
      // afterScroll: function(){ $('#select-provider-wrapper > .active .provider-search').focus(); }
    });
    if (isMac) {
      var $leList = $($(this).attr('href')).find('.provider-list');
      setTimeout(function(){
        if ($leList[0].clientHeight < $leList[0].scrollHeight) {
          $leList.next().find('.scroll-hint').removeClass('no-show');
        }
      }, 300)
    }
  });


  //create the filter-able lists
  //TODO consider optimizing this to work with single instance
  var listOptions = {
    listClass: 'provider-list',
    searchClass: 'provider-search-name',
    valueNames: [ 'provider-link']
  };

  var insuranceList = new List('insurance-list-wrapper', listOptions);
  var physicianList = new List('physician-list-wrapper', listOptions);
  var pharmacyList = new List('pharmacy-list-wrapper', listOptions);
  var labList = new List('lab-list-wrapper', listOptions);
  var immunizationList = new List('immunization-list-wrapper', listOptions);
  //TODO bring this back once we replace the "coming soon" with actual HIE listings
  // var hieList = new List('hie-list-wrapper', listOptions);


  // HIDE/SHOW the list depending on if there is something in the search/filter input
  // $('body').on('input keychange', '.provider-search', function(evt) {
    // var $toToggle = $(this).parents('.providers').find('.no-data, .provider-list');
    // if ($('.provider-search').val() !== '') {
    //   $toToggle.removeClass('hide');
    // } else {
    //   $toToggle.addClass('hide');
    // }
  // });

  $('body').on('input keychange', '.provider-search-name', function(evt) {
    //when free text searching, clear out the state filter (which is only on physicianList)
    var $pvs = $('.provider-search-state')
    if ($pvs.val() !== 'false') {
      $pvs.val('false');
      physicianList.filter();
    }
  });

  $('body').on('change', '.provider-search-state', function(evt) {
    var $self = $(this);
    var selState = $self.val();
    //TODO standardize on DC vs District of Columbia
    if (selState == 'false') {
      physicianList.filter();
      return false;
    }
    if (selState == "district of columbia") selState = "dc"
    var filterByState = function(item) {
      var leState = $(item.elm).find('a').attr('data-state');
      if (leState && selState == leState.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    }
    eval($self.closest('.tab-pane').attr('id') + 'List.filter(filterByState)');
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

});
