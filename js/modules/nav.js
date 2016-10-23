(function($nav){
	if (!$nav.length) { return false; }

	var $toggleNav = $nav.find('.menu-call-m');
	var $menu = $nav.find('.menu-mob-wrap');
	var $fb = $nav.find('.menu-fb');

	var $menuItems = $menu.find('.menu-itm').find('a');

	var $body = $('body');
	var $hero = $('.main-hero');

	// WHO USES PNG LOGOS IN 2016???!!!
	var $brightLogo = $nav.find('#logo-bright');
	var $darkLogo = $nav.find('#logo-dark');

	var ww = $(window).width();
	var heroHeight = $hero.height();
	var breakpoint = 768;


	// set heights
	// Reset nav is breakpoint changes
	$(window).on('resize', function(e) {
		ww = $(window).width();
		heroHeight = $hero.height();
		if (ww >= breakpoint) {
			$menu.removeClass('open');
			$menu.removeAttr('style');
			$toggleNav.removeClass('open');
			$body.css('overflow', 'auto');
		}
	});

	// Menu controller
	$(window).on('scroll', function(e) {
		if (ww < breakpoint) {
			if (window.pageYOffset > 65) {
				if ($brightLogo.is(':visible')) {
					$brightLogo.hide();
					$darkLogo.show();
				}
				$nav.addClass('shrink');
			} else {
				if (!$brightLogo.is(':visible')) {
					$brightLogo.show();
					$darkLogo.hide();
				}
				$nav.removeClass('shrink');
			}
		} else {
			if (window.pageYOffset > heroHeight) {
				$nav.addClass('shrink');
			} else if (window.pageYOffset < 65) {
				$nav.removeClass('shrink');
			}
		}
	});

	// Trigger mobile nav
	$toggleNav.on('click', function(e) {
		e.preventDefault();

		if (!$menu.is(':visible')) {
			$body.css('overflow', 'hidden');
			$toggleNav.toggleClass('open');
			$menu.slideDown(300, function(){
				$fb.fadeIn(100);
			}).toggleClass('open');
			$brightLogo.show();
			$darkLogo.hide();
		} else {
			$body.css('overflow', 'auto');
			$fb.fadeOut(10);
			$menu.slideUp(300, function(){
				$toggleNav.toggleClass('open');
				if (window.pageYOffset > 65) {
					$brightLogo.hide();
					$darkLogo.show();
				} else {
					$brightLogo.show();
					$darkLogo.hide();
				}
			}).toggleClass('open');
		}
	});


	// Click menu item handler
	$menuItems.on('click', function(e) {
		e.preventDefault();
		if (ww < breakpoint) {
			$body.css('overflow', 'auto');
			$fb.fadeOut(10);
			$menu.slideUp(10).toggleClass('open');
			$toggleNav.toggleClass('open');
			$('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 65
	    }, 600);
		} else {
			$('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 65
	    }, 800);
		}
	});
})($('.nav'));