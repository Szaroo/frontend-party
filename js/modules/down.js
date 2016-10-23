(function($down){
	$down.on('click', function(e) {
		e.preventDefault();
		$('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 65
    }, 800);
	});
})($('.btn-go'));