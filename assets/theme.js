KROWN.themeName = 'Kingdom';
KROWN.themeVersion = '5.0.0';

// Shopify events

const executeOnceOnDomContentLoaded = ()=>{

	// input helpers

	document.querySelectorAll('input').forEach(elm=>{
		elm.addEventListener('change',e=>{
			if ( e.target.value != '' ) {
				e.target.classList.add('filled');
			} else {
				e.target.classList.remove('filled');
			}
		})
	});
	document.querySelectorAll('input[type="search"]').forEach(elm=>{elm.value=''});

	// a11y tab helper 

	let activeElement = document.activeElement;
	document.addEventListener('keyup', e=>{
		if ( e.keyCode == window.KEYCODES.TAB ) {
      if ( activeElement.classList.contains('focus') && e.target != activeElement ) {
      	activeElement.classList.remove('focus');
      }
      if ( e.target.classList.contains('regular-select-cover') ||
      	e.target.classList.contains('search-field') ||
      	e.target.classList.contains('product-item__link') ||
      	e.target.classList.contains('content-slider') || 
      	e.target.classList.contains('blog-item__header') ||
      	e.target.classList.contains('toggle__title') ||
      	e.target.tagName == 'INPUT'
      ) {
      	activeElement = e.target;
        e.target.classList.add('focus');
      } 
    }
	});

  // newsletter has jump

	if ( window.location.search == '?customer_posted=true' ) {
		setTimeout(()=>{
			window.scroll({
			  top: document.querySelector('form .alert').offsetTop - 250, 
			  behavior: 'smooth'
			});
		}, 300);
	} else if ( window.location.pathname.includes('/challenge') ) {
		setTimeout(()=>{
			window.scroll({
			  top: 0, 
			  behavior: 'auto'
			});
		}, 300);
	}

}

if ( document.readyState !== 'loading' ) {
	executeOnceOnDomContentLoaded();
} else {
	document.addEventListener('DOMContentLoaded', executeOnceOnDomContentLoaded);
}

// method for apps to tap into and refresh the cart

if ( ! window.refreshCart ) {

	window.refreshCart = () => {
		
		fetch('?section_id=cart-helper')
			.then(response => response.text())
			.then(text => {

				const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html');
				const cartFormInnerHTML = sectionInnerHTML.getElementById('AjaxCartForm').innerHTML;
				const cartSubtotalInnerHTML = sectionInnerHTML.getElementById('AjaxCartSubtotal').innerHTML;

				const cartItems = document.getElementById('AjaxCartForm');
				cartItems.innerHTML = cartFormInnerHTML;
				cartItems.ajaxifyCartItems();
				document.querySelector('[data-header-cart-count]').textContent = cartItems.querySelector('[data-cart-count]').textContent;

				document.getElementById('AjaxCartSubtotal').innerHTML = cartSubtotalInnerHTML;

				document.querySelector('.sidebar__cart').show();

		})

	}

}

/**
 * Article Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Article template.
 *
   * @namespace product
 */

theme.Article = (function() {
  /**
   * Article section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Article(container) {
    var $container = this.$container = $(container);
    var hasSidebar = $('.sidebar').length;

    if (hasSidebar) {
      sidebarNav();
    }

    stickyElements($container);

    $( window ).on( 'resize', $.debounce( 100, function() {
      stickyElements( $container );
    } ) );
  }


  function sidebarNav() {
    var isMobile = $(window).width() < 750;
    var hasCategories = $('.widget--categories').length;

    navStates();

    // Dropdown Menus
    $('.widget__links li.has-sub-nav > a').on('click touchstart', function(e) {
      if (!isMobile) {
        var submenu = $(this).next('.submenu');

        submenu.parent().toggleClass('active');
        submenu.stop(true, false).slideToggle().toggleClass('open');
        checkAriaStatus(submenu);

        e.preventDefault();
      }
    });

    if (hasCategories) {
      categories();

      $(window).on('resize', categories);
    }
  }

  function checkAriaStatus( submenu ) {
    var state = submenu.hasClass('open');

    if (state){
      submenu.attr( 'aria-expanded', true );
    } else {
      submenu.attr( 'aria-expanded', false );
    }
  }

  // Nav Active States
  function navStates(){
    var links = $('.widget__links .has-sub-nav > a'),
        sub_links = $('.widget__links .submenu > li > a');

    links.each(function(){
      var href = $(this).attr('href'),
          location = window.location.pathname;

      if (href === location){
        $(this).closest('.has-sub-nav').addClass('active').find('.submenu').show();
      }
    });

    sub_links.each(function(){
      var href = $(this).attr('href'),
          location = window.location.pathname;

      if (href === location){
        $(this).closest('li').addClass('active');
        $(this).closest('.has-sub-nav').addClass('active').find('.submenu').show();
      }
    });
  }

  function stickyElements( $container ) {
    var isMobile = $(window).width() < 750;
    var hasSidebar = $( '.sidebar' ).length;
    var hasSocial = $( '.article__social' ).length;

    if ( hasSidebar ) {
      if ( !isMobile ) {
        var bottomSpacingSidebar = $('.site-footer').outerHeight();

        $container.find( '.sidebar__contents' ).stick_in_parent({
          parent: '.article__wrapper',
          bottomSpacing: 30
        });

      } else {
        // Destroy sticky on mobile
        $container.find('.sidebar__contents').trigger("sticky_kit:detach");
      }
    }

    if (hasSocial) {
      var bottomSpacingSocial = parseInt($(document).height() - $('.article__content').offset().top - $('.article__content').outerHeight());

      if (!isMobile) {
        $container.find('.article__social').stick_in_parent({
          parent: '.article__content__wrapper'
        });
      } else {
        // Destroy sticky on mobile
        $container.find('.article__social').trigger("sticky_kit:detach");
      }
    }
  }

  function categories() {
    var isMobile = $(window).width() < 750;
    var menuCategories = $('.widget--categories .widget__links');
    var activeLink = menuCategories.find('li.active').index();
    var hasSlick = menuCategories.hasClass('slick-initialized');

    navStates();

    if (isMobile) {
      if (!hasSlick) {
        $('.widget--categories').prependTo('.article--single');
        menuCategories.slick({
          initialSlide: activeLink,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-right" viewBox="0 0 20 38"><path d="M15.932 18.649L.466 2.543A1.35 1.35 0 0 1 0 1.505c0-.41.155-.77.466-1.081A1.412 1.412 0 0 1 1.504 0c.41 0 .756.141 1.038.424l16.992 17.165c.31.283.466.636.466 1.06 0 .423-.155.777-.466 1.06L2.542 36.872a1.412 1.412 0 0 1-1.038.424c-.41 0-.755-.141-1.038-.424A1.373 1.373 0 0 1 0 35.813c0-.423.155-.776.466-1.059L15.932 18.65z" fill="#726D75" fill-rule="evenodd"></path></svg></button>',
          nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-right" viewBox="0 0 20 38"><path d="M15.932 18.649L.466 2.543A1.35 1.35 0 0 1 0 1.505c0-.41.155-.77.466-1.081A1.412 1.412 0 0 1 1.504 0c.41 0 .756.141 1.038.424l16.992 17.165c.31.283.466.636.466 1.06 0 .423-.155.777-.466 1.06L2.542 36.872a1.412 1.412 0 0 1-1.038.424c-.41 0-.755-.141-1.038-.424A1.373 1.373 0 0 1 0 35.813c0-.423.155-.776.466-1.059L15.932 18.65z" fill="#726D75" fill-rule="evenodd"></path></svg></button>'
        });
      }
    } else {
      if (hasSlick) {
        menuCategories.slick('unslick');
        $('.widget--categories').prependTo('.sidebar__contents');
      }
    }
  }

  return Article;
  
})();
