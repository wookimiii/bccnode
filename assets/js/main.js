(function($) {
"use strict";
var WITHEMES = WITHEMES || {};

function counter( ele, number ){

	if ( typeof(ele)!='object' ) return;
	ele.find('.number').empty();

	if ( !number ) number = 0;
	var number = number.toString();
	var numArray = number.split("");

	for(var i=0; i<numArray.length; i++) { 
		numArray[i] = parseInt(numArray[i], 10);
		ele.find('.number').append('<span class="digit-con"><span class="digit'+i+'">0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br></span></span>');	
	}

	var increment = ele.find('.digit-con').outerHeight();
	var speed = 1000;

	for(var i=0; i<numArray.length; i++) {
		ele.find('.digit'+i).animate({top: -(increment * numArray[i])}, speed);
	}

	ele.find(".digit-con:nth-last-child(3n+4)").after("<span class='comma'>,</a>");
	
	$(window).resize(function(){
		counter( ele, number );
							  });
	
}

/* --------------------------------------------------------------------------------------------- */
/* Retina
/* --------------------------------------------------------------------------------------------- */
WITHEMES.retina_logo = function(){
	var retina = window.devicePixelRatio > 1 ? true : false;
	if(retina) {
		$('#wi-logo img').attr({src:'./assets/logo@2x.png',width:'122',height:'37'});
		$('#wi-footer .footer-logo img').attr({src:'./assets/footer-logo@2x.png',width:'161',height:'49'});
	}
	
};	// retina_logo

/* --------------------------------------------------------------------------------------------- */
/* Sticky Header
/* --------------------------------------------------------------------------------------------- */
WITHEMES.sticky = function(){
	if ( $().sticky ) {
		$('#wi-header').sticky({topSpacing:0});
	}; // if sticky exists
};	// sticky

/* --------------------------------------------------------------------------------------------- */
/* Contactform
/* --------------------------------------------------------------------------------------------- */
WITHEMES.contact = function(){
//	http://www.bitrepository.com/a-simple-ajax-contact-form-with-php-validation.html
$('.contactform').each(function(){
	var $this = $(this);	
	$this.submit(function() {
		var str = $this.serialize();
		$.ajax({
			type:	"POST",
			url:	$this.attr('action'),
			data:	str,
			success: function(msg) {
    			// Message Sent? Show the 'Thank You' message and hide the form
				var result;
    			if(msg == 'OK') {
    				result = '<div class="notification_ok">Your message has been sent. Thank you!</div>';
    			} else {
    				result = msg;
    			}
				result = '<div class="result">' + result + '</div>';
    			$this.find('.note').html(result);
			}
		});
		return false;
	});	// submit
	
							   });	// each contactform
};	// contact

/* ------------------------------------------------------------------ */
/* Fitvids
/* ------------------------------------------------------------------ */
WITHEMES.fitvids = function(){
	if ( $().fitVids ) {
		$('.media-container').fitVids();
	}
}; // fitvids

/* --------------------------------------------------------------------------------------------- */
/* BigText
/* --------------------------------------------------------------------------------------------- */
WITHEMES.bigtext = function(){
	var bt = BigText.noConflict(true);
	$.fn.bt = bt.jQueryMethod;
	$('.bigtext').bt();
};	// bigtext

/* --------------------------------------------------------------------------------------------- */
/* Arctext
/* --------------------------------------------------------------------------------------------- */
WITHEMES.arctext = function(){
	if ( $().arctext ) {
		$('.arctext').find('.uppertext').arctext({radius:26});
		$('.arctext').find('.lowertext').arctext({radius:70, dir:-1});
	}; // if arctext exists
};	// arctext


/* ------------------------------------------------------------------ */
/* Autosize
/* ------------------------------------------------------------------ */
WITHEMES.autosize = function(){
	if ( $().autosize )	{
		$('textarea').autosize();
	}
}; // autosize

/* --------------------------------------------------------------------------------------------- */
/* Isotope
/* --------------------------------------------------------------------------------------------- */
WITHEMES.isotope = function(){
	if ( $().isotope ) {
		// initialize isotope
		$('.wi-portfolio').isotope({
			itemSelector: '.portfolio-item',
			animationEngine: 'best-available',
			animationOptions: {
					duration: 250,
					easing: 'easeInOutSine',
					queue: false
		   }
						});	// isotope
			
		// filter items when filter link is clicked
		$('.wi-portfolio-filter li').on('click',function(){
			$('.wi-portfolio-filter li').removeClass('active');
			$(this).addClass('active');
			var selector = $(this).find("a").attr('data-filter');
			$('.wi-portfolio').isotope({ filter: selector });
			return false;
		});	// on click
			
	}; // if isotope exists
};	// isotope

/* --------------------------------------------------------------------------------------------- */
/* Testimonial Slider
/* --------------------------------------------------------------------------------------------- */
WITHEMES.testimonial_slider = function(){
	if ( $().flexslider ) {
		$('.testimonial-slider').each(function(){
		var $this = $(this);
		$this.find('.flexslider').flexslider({
			animation		:	$this.data('effect'),
			pauseOnHover	:	true,
			useCSS			:	false,
			animationSpeed	:	600,
			slideshowSpeed	:	$this.data('time'),
			controlNav		:	$this.data('pager'),
			directionNav	:	$this.data('nav'),
			slideshow		:	$this.data('auto'),
			prevText		:	'<i class="icon-angle-left"></i>',
			nextText		:	'<i class="icon-angle-right"></i>',
			smoothHeight	:	true,
			start: function(slider) {
				slider.animate({opacity:1});
			},
							 });	// flexslider
										   }); // each testimonial-slider
	}; // if flexslider exists
};	// testimonial slider

/* --------------------------------------------------------------------------------------------- */
/* Scrollup
/* --------------------------------------------------------------------------------------------- */
WITHEMES.scrollup = function(){
	$(window).scroll(function(){
		if ($(this).scrollTop() > 600 ) {
			$('#scrollup').fadeIn();
		} else {
			$('#scrollup').fadeOut();
		}
	}); 
	
	$('.scrollup').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 1000 , 'easeInOutExpo');
		return false;
	});
};	// scrollup

/* ------------------------------------------------------------------ */
/* Create dropdown nav for mobile
/* ------------------------------------------------------------------ */
String.prototype.repeat = function( num ) {
	return new Array( num + 1 ).join( this );
}

WITHEMES.mobile_nav = function(){
		/* Create select */
	$('<select id="wi-mainnav-mobile" />').appendTo( $('#wi-mainnav').parent() );
		/* Option */
	$('<option />', {
	   "selected": "selected",
	   "value"   : "",
	   "text"    : 'Go to...'
	}).appendTo('#wi-mainnav-mobile');
		/* Populate dropdown */
	$("#wi-mainnav a").each(function() {
		var el = $(this);
		var option = $("<option />", {
			"value"   : el.attr("href"),
			"text"    : ('-'.repeat(el.parents("ul.children, ul.sub-menu").length)  + ' ' + el.text())
		}).appendTo('#wi-mainnav-mobile');
		if (el.parent().hasClass('current_menu_item') || el.parent().hasClass('active')) option.attr('selected','selected');
	});
	
}; // mobile_nav

/* ------------------------------------------------------------------ */
/* ScrollTo
/* ------------------------------------------------------------------ */
WITHEMES.scrollto = function(){
		/* scroll to target */
	$(window).load(function(){
		$('.onepage #wi-mainnav li a,.btn-scroll').on('click',function(e){
			var href = $(this).attr('href');
			var hash;
			if (href) hash = href.split('#')[1];
			if(hash){
				if ( $('#'+hash).length > 0 ) {
					e.preventDefault();
					var header_height = $('#wi-header').outerHeight();
					var offset_top = $('#'+hash).offset().top - header_height + 1;
					$('html,body').animate({ scrollTop: offset_top}, 1000, 'easeInOutExpo');
				}
			} // if hash
		});	// onepage menu li a click
		
		$('#wi-mainnav-mobile').on('change',function(e){
			var href = $(this).val();
			var hash; if (href) hash = href.split('#')[1];
			if(hash && $('body').hasClass('onepage') ){
				if ( $('#'+hash).length > 0 ) {
					e.preventDefault();
					var header_height = $('#wi-header').outerHeight();
					var offset_top = $('#'+hash).offset().top - header_height + 1;
					$('html,body').animate({ scrollTop: offset_top}, 1000, 'easeInOutExpo');
				}
			} else if ( href.length > 0 ) {
				self.location = href;
				}
													 }); // on mobile menu change
		
							});	// window load
	
		/* change active class when click */
	$(".onepage #wi-mainnav li").click(function () {
		$(".onepage #wi-mainnav li").removeClass("active");
		$(this).addClass("active")
	});
	
		/* change active class when scroll */
	var lastid,	scroll_items = $(".onepage #wi-mainnav").find('a').map(function () {
			var href = $(this).attr("href");
			var hash = href.split('#')[1];
			if(hash){
				if ( $('#' + hash).length > 0 ) return $('#' + hash);
			}
		});
	$(window).scroll(function () {
		var from_top = $(this).scrollTop() + $(".onepage #wi-mainnav").outerHeight() + 100;
		var cur = scroll_items.map(function () {
			if ($(this).offset().top < from_top ) return this
		});
		cur = cur[cur.length - 1];
		var id = ( cur && cur.length ) ? cur[0].id : '';
		if (lastid !== id) {
			lastid = id;			
			
			$('.onepage #wi-mainnav li a').each(function(){
				var hash = $(this).attr('href').split('#')[1];
				if ( hash == id ) {
					$(this).parent().addClass("active");
				} else {
					$(this).parent().removeClass("active");
				}
			});	// each wi mainnav li a
			
			$('#wi-mainnav-mobile option').each(function(){
				var hash = $(this).attr('value').split('#')[1];
				if ( hash == id ) {
					$(this).attr('selected','selected');
				} else {
					$(this).removeAttr('selected');
				}	 
														 });
		}	// if lastid !== id
	});	// scroll

};	// scrollto

/* ------------------------------------------------------------------ */
/* Blogslider
/* ------------------------------------------------------------------ */
WITHEMES.blogslider = function(){
	if ( $().flexslider ) {
	
		$('.slider-thumbnail').each(function(){
			var $this = $(this);
			var easing = ( $this.data('effect') == 'fade' ) ? 'linear' : 'easeInOutExpo';
			$this.find('.flexslider').flexslider({
				animation		:	$this.data('effect'),
				pauseOnHover	:	true,
				useCSS			:	false,
				easing			:	easing,
				animationSpeed	:	500,
				slideshowSpeed	:	5000,
				controlNav		:	false,
				directionNav	:	$this.data('navi'),
				slideshow		:	$this.data('auto'),
				prevText		:	'<i class="icon-angle-left"></i>',
				nextText		:	'<i class="icon-angle-right"></i>',
				smoothHeight	:	true,
				start: function(slider) {
					slider.removeClass('preload');
				},
								 });	// flexslider
										});	// each
				
	}	// endif flexslider
}; // blogslider

/* --------------------------------------------------------------------------------------------- */
/* Colorbox
/* --------------------------------------------------------------------------------------------- */
WITHEMES.colorbox = function(){
	if ( $().colorbox ) {
		$('.wi-colorbox').colorbox({
				transition	:	'elastic',
				speed		:	300,
				maxWidth	:	'90%',
				maxHeight	:	'90%',
				returnFocus	:	false,
			});		
	} // endif colorbox
}; // colorbox

/* ------------------------------------------------------------------ */
/* Animations
/* ------------------------------------------------------------------ */
WITHEMES.animations = function(){
	function wi_inview(ele) {
		var	window_top = $(window).scrollTop(),
			offset_top = $(ele).offset().top;
		if ( $(ele).length > 0 ) {
			if (	offset_top + $(ele).height() - 100 >= window_top &&
					offset_top <= ( window_top + 0.85 * $(window).height() ) ) {
					return true;
			} else {
				return false;
			}
		}
	}
	
	/* setting intervals to prevent animations run out of control */
	function run_animations() {
		var did_scroll = false;
		$(window).on('scroll',function () {
			did_scroll = true;
		});
		setInterval(function () {
			if (did_scroll) {
				did_scroll = false;
				
				/* random */
				if ( !$('html').hasClass('ie8') ) {
				$('.wi-count').each(function() {
					var $this = $(this);
					
					if ( !$this.data('complete') ) {
						$this.find('.number').text('').css({opacity:0});
					}
					if ( wi_inview($this) && !$this.data('complete') ) {
						$this.data('complete',true);
						var delay = parseInt($this.data('delay'));
						setTimeout(function(){
							$this.find('.number').animate({opacity:1});
							counter( $this, $this.data('number') );
											}, delay );
					}	// if wi_inview
				});	// each wi count
				}	// endif not IE
				
				/* portfolio */
				$('.wi-portfolio .portfolio-item').each(function(){
					var $this = $(this);
					var delay = parseInt($this.data('delay'));
					if ( wi_inview($this) ) {
						setTimeout(function(){
							$this.addClass('visible');
											},delay); // setTimeout
					}	// if wi_inview
											  });	// each portfolio item
				
			} // did scroll
		}, 200); // setInterval
	}	// run animations
	run_animations();
	
};

/* ------------------------------------------------------------------ */
/* Init functions
/* ------------------------------------------------------------------ */
$(document).ready(function() {
	WITHEMES.sticky();
	WITHEMES.arctext();
	WITHEMES.scrollto();
	WITHEMES.colorbox();
	WITHEMES.fitvids();
	WITHEMES.mobile_nav();
	WITHEMES.autosize();
	WITHEMES.scrollup();
	WITHEMES.contact();
	$(window).load(function(){
		WITHEMES.bigtext();
		WITHEMES.blogslider();
		WITHEMES.animations();
		WITHEMES.testimonial_slider();
		WITHEMES.isotope();
		WITHEMES.retina_logo();
							}); // window load
	$(window).resize(function(){
		if ( $().isotope ) {
			$('.wi-portfolio').isotope('reLayout');
			}
							  });
						   });
})(jQuery);	// EOF