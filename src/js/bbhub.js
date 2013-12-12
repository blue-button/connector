$(function() {
  $('a.next-btn').smoothScroll();

  $('body').on('click', 'a.box-link-rapper', function(evt) {
    $.smoothScroll({
      scrollTarget: '#select-provider-wrapper',
      afterScroll: function(){ $('#select-provider-wrapper > .active .provider-search').focus(); }
    });
  });

  var listOptions = {
    listClass: 'provider-list',
    searchClass: 'provider-search',
    valueNames: [ 'provider-link']
  };

  var providerList = new List('insurance-list-wrapper', listOptions);

  $('body').on('click', 'a.vid-still', function(evt) {
    var $self = $(this);
    var $vidmodal = $('#vid-modal');
    $('#vid-frame').data('yturl', '//www.youtube.com/embed/' + $self.data('ytid') + '?rel=0&theme=dark&modestbranding=0&color=white&controls=1&autohide=1&showinfo=0&hd=1&autoplay=1');
    // $vidmodal.find('.modal-title').html($self.find('.caption').text())
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
