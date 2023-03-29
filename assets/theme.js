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