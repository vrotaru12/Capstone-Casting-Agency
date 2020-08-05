(function ($) {


	$.fn.navList = function() {
		var	$this = $(this),$a = $this.find('a'),b = [];

		$a.each(function() {
			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' + 'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	$.fn.panel = function(userConfig) {
		var	$this = $(this);
		if (this.length == 0)
			return $this;

		if (this.length > 1) {
			for (var i=0; i < this.length; i++)
				$(this[i]).panel(userConfig);
			return $this;
		}	
		return $this;
	};


	var $window = $(window),$body = $('body');
	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch mode.
	if (browser.mobile)
		$body.addClass('is-touch');

	// Scrolly links.
	$('.scrolly').scrolly({
		speed: 2000
	});

	// Dropdowns.
	$('#nav > ul').dropotron({
		alignment: 'right',
		hideDelay: 350
	});


	// Panel.
	$('<div id="navPanel">' +'<nav>' +$('#nav').navList() +'</nav>' +'</div>')
		.appendTo($body).panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'left',
			target: $body,
			visibleClass: 'navPanel-visible'
		});

	// Parallax.
	// Disabled on IE (choppy scrolling) and mobile platforms (poor performance).
	if (browser.name == 'ie'|| browser.mobile) {
		$.fn._parallax = function () {
			return $(this);
		};
	}
	else {
		$.fn._parallax = function () {
			$(this).each(function () {
				var $this = $(this),on, off;
				on = function () {
					$this.css('background-position', 'center 0px');
					$window.on('scroll._parallax', function () {
					var pos = parseInt($window.scrollTop()) - parseInt($this.position().top);
					$this.css('background-position', 'center ' + (pos * -0.15) + 'px');});
				};

				off = function () {
					$this.css('background-position', '');
					$window.off('scroll._parallax');
				};
				breakpoints.on('<=medium', off);
				breakpoints.on('>medium', on);

			});
			return $(this);

		};
		$window
			.on('load resize', function () {
				$window.trigger('scroll');
			});

	}

	// Spotlights.
	var $spotlights = $('.spotlight');

	$spotlights._parallax().each(function () {
	var $this = $(this),on, off;
			on = function () {
				var top, bottom, mode;
				// Use main <img>'s src as this spotlight's background.
				$this.css('background-image', 'url("' + $this.find('.image.main > img').attr('src') + '")');
				// Side-specific scrollex tweaks.
				if ($this.hasClass('top')) {
					mode = 'top';
					top = '-20%';
					bottom = 0;
				}
				else if ($this.hasClass('bottom')) {
					mode = 'bottom-only';
					top = 0;
					bottom = '20%';
				}
				else {
					mode = 'middle';
					top = 0;
					bottom = 0;
				}

				// Add scrollex.
				$this.scrollex({
					mode: mode,
					top: top,
					bottom: bottom,
					initialize: function (t) { $this.addClass('inactive'); },
					terminate: function (t) { $this.removeClass('inactive'); },
					enter: function (t) { $this.removeClass('inactive'); },
				});

			};

			off = function () {
				// Clear spotlight's background.
				$this.css('background-image', '');
				// Remove scrollex.
				$this.unscrollex();

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

	// Wrappers.
	var $wrappers = $('.wrapper');
	$wrappers.each(function () {
			var $this = $(this),on, off;
			on = function () {
				$this.scrollex({
					top: 250,
					bottom: 0,
					initialize: function (t) { $this.addClass('inactive'); },
					terminate: function (t) { $this.removeClass('inactive'); },
					enter: function (t) { $this.removeClass('inactive'); },
				});
			};
			off = function () {
				$this.unscrollex();
			};
			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);
		});

	// Banner.
	var $banner = $('#banner');
	$banner._parallax();
})(jQuery);
