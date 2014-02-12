$(function() {
  $('a.next-btn').smoothScroll();

  $('body').on('click', 'a.box-link-rapper', function(evt) {
    $.smoothScroll({
      scrollTarget: '#select-provider-wrapper',
      // afterScroll: function(){ $('#select-provider-wrapper > .active .provider-search').focus(); }
    });
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
  var immunizationList = new List('immunization-list-wrapper', listOptions);


  // HIDE/SHOW the list depending on if there is something in the search/filter input
  // $('body').on('input keychange', '.provider-search', function(evt) {
    // var $toToggle = $(this).parents('.providers').find('.no-data, .provider-list');
    // if ($('.provider-search').val() !== '') {
    //   $toToggle.removeClass('hide');
    // } else {
    //   $toToggle.addClass('hide');
    // }
  // });

  $('body').on('change', '.provider-search-state', function(evt) {
    var $self = $(this);
    var selState = $self.val();
    //TODO standardize on DC vs District of Columbia
    if (selState == 'false') {
      eval($self.closest('.tab-pane').attr('id') + 'List.filter()');
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
    console.log($vidframe.data('yturl'));
    $vidframe.attr('src', $vidframe.data('yturl'));
  });

});
