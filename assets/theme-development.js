/* https://github.com/electerious/basicLightbox/blob/master/src/scripts/main.js - fork */

const basicLightbox = {

  // "private"

  _toElement: function(html, children = false) {
    const elem = document.createElement('div')
    elem.innerHTML = html.trim()
    return children === true ? elem.children : elem.firstChild
  },
  
  _validateOptions: function(opts = {}) {

    opts = Object.assign({}, opts)
  
    if (opts.closable == null) opts.closable = true
    if (opts.className == null) opts.className = ''
    if (opts.onShow == null) opts.onShow = () => {}
    if (opts.onClose == null) opts.onClose = () => {}
    if (opts.trigger == null) opts.trigger = false
    if (opts.focus == null) opts.focus = false
  
    return opts
  
  },

  _validateContent: function(content) {

    const isString = typeof content === 'string'
    const isHTMLElement = content instanceof HTMLElement === true
  
    if (isString === false && isHTMLElement === false) {
      throw new Error('Content must be a DOM element/node or string')
    }
  
    if (isString === true) {
      // String
      return Array.from(this._toElement(content, true))
    } else if (content.tagName === 'TEMPLATE') {
      // Template
      return [ content.content.cloneNode(true) ]
    } else {
      // HTMLElement
      return Array.from(content.children)
    }
  
  },

  _containsTag: function(elem, tag) {
    const children = elem.children
    return (children.length === 1 && children[0].tagName === tag)
  },

  _render: function(content, opts) {

    const elem = this._toElement(`
      <div class="basicLightbox ${ opts.className }">
        <div class="basicLightbox__placeholder" role="dialog"></div>
      </div>
    `)
    const placeholder = elem.querySelector('.basicLightbox__placeholder')
  
    content.forEach((child) => placeholder.appendChild(child))
  
    const img = this._containsTag(placeholder, 'IMG')
    const video = this._containsTag(placeholder, 'VIDEO')
    const iframe = this._containsTag(placeholder, 'IFRAME')
  
    if (img === true) elem.classList.add('basicLightbox--img')
    if (video === true) elem.classList.add('basicLightbox--video')
    if (iframe === true) elem.classList.add('basicLightbox--iframe')
  
    return elem
  
  },
  
  _show: function(elem, next) {

    document.body.appendChild(elem)
  
    setTimeout(() => {
      requestAnimationFrame(() => {
        elem.classList.add('basicLightbox--visible')
        return next()
      })
    }, 10)
  
    return true
  
  },

  _close: function(elem, next) {
    elem.classList.remove('basicLightbox--visible')
  
    setTimeout(() => {
      if (this._visible(elem) === false) return next()
      elem.parentElement.removeChild(elem)
      return next()
    }, 410)
  
    return true
  
  },
  
  _visible: function(elem) {
    elem = elem || document.querySelector('.basicLightbox')
    return (elem != null && elem.ownerDocument.body.contains(elem) === true)
  },

  // "public"

  create: function(content, opts) {

  	content = this._validateContent(content)
    opts = this._validateOptions(opts)
  
    const elem = this._render(content, opts)
  
    const _element = () => {
      return elem
    }
  
    const _visible = () => {
      return this._visible(elem)
    }
  
    const _show = (next, focus) => {
      if (opts.onShow(instance) === false) return false
  
      return this._show(elem, () => {
        if (typeof focus === 'string' ) {
         if ( elem.querySelectorAll(focus) ) {
          elem.querySelectorAll(focus)[0].focus();
         }
        }
        if (typeof next === 'function') return next(instance)
      })
  
    }
  
    const _close = (next) => {
  
      if (opts.onClose(instance) === false) return false
  
      return this._close(elem, () => {
        if (typeof next === 'function') return next(instance)
      })
  
    }
  
    if (opts.closable === true) {
      elem.addEventListener('click', (e) => {
        if (e.target !== elem) return
        _close()
      })
      window.addEventListener('keydown', (e) => {
        if ( e.keyCode == 27 ) _close()
      })
      if ( elem.querySelector('.basicLightboxClose') ) {
        elem.querySelector('.basicLightboxClose').addEventListener('click', (e) => {
          e.preventDefault();
          _close();
        })
        elem.querySelector('.basicLightboxClose').addEventListener('keydown', (e) => {
          if ( e.keyCode == 13 ) _close();
        })
      }
    } 

    if (opts.trigger) {
      opts.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        _show(null, opts.focus);
      })
      opts.trigger.addEventListener('keydown', (e) => {
        if ( e.keyCode == 13 ) {
          _show(null, opts.focus)
        }
      })
    }
  
    // Assign instance to a variable so the instance can be used
    // elsewhere in the current function.
    const instance = {
      element: _element,
      visible: _visible,
      show: _show,
      close: _close
    }
  
    return instance
  
  }

};
!function(){"use strict";function o(){var o=window,t=document;if(!("scrollBehavior"in t.documentElement.style&&!0!==o.__forceSmoothScrollPolyfill__)){var l,e=o.HTMLElement||o.Element,r=468,i={scroll:o.scroll||o.scrollTo,scrollBy:o.scrollBy,elementScroll:e.prototype.scroll||n,scrollIntoView:e.prototype.scrollIntoView},s=o.performance&&o.performance.now?o.performance.now.bind(o.performance):Date.now,c=(l=o.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(l)?1:0);o.scroll=o.scrollTo=function(){void 0!==arguments[0]&&(!0!==f(arguments[0])?h.call(o,t.body,void 0!==arguments[0].left?~~arguments[0].left:o.scrollX||o.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:o.scrollY||o.pageYOffset):i.scroll.call(o,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:o.scrollX||o.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:o.scrollY||o.pageYOffset))},o.scrollBy=function(){void 0!==arguments[0]&&(f(arguments[0])?i.scrollBy.call(o,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):h.call(o,t.body,~~arguments[0].left+(o.scrollX||o.pageXOffset),~~arguments[0].top+(o.scrollY||o.pageYOffset)))},e.prototype.scroll=e.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==f(arguments[0])){var o=arguments[0].left,t=arguments[0].top;h.call(this,this,void 0===o?this.scrollLeft:~~o,void 0===t?this.scrollTop:~~t)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value could not be converted");i.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},e.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==f(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):i.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},e.prototype.scrollIntoView=function(){if(!0!==f(arguments[0])){var l=function(o){for(;o!==t.body&&!1===(e=p(l=o,"Y")&&a(l,"Y"),r=p(l,"X")&&a(l,"X"),e||r);)o=o.parentNode||o.host;var l,e,r;return o}(this),e=l.getBoundingClientRect(),r=this.getBoundingClientRect();l!==t.body?(h.call(this,l,l.scrollLeft+r.left-e.left,l.scrollTop+r.top-e.top),"fixed"!==o.getComputedStyle(l).position&&o.scrollBy({left:e.left,top:e.top,behavior:"smooth"})):o.scrollBy({left:r.left,top:r.top,behavior:"smooth"})}else i.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function n(o,t){this.scrollLeft=o,this.scrollTop=t}function f(o){if(null===o||"object"!=typeof o||void 0===o.behavior||"auto"===o.behavior||"instant"===o.behavior)return!0;if("object"==typeof o&&"smooth"===o.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+o.behavior+" is not a valid value for enumeration ScrollBehavior.")}function p(o,t){return"Y"===t?o.clientHeight+c<o.scrollHeight:"X"===t?o.clientWidth+c<o.scrollWidth:void 0}function a(t,l){var e=o.getComputedStyle(t,null)["overflow"+l];return"auto"===e||"scroll"===e}function d(t){var l,e,i,c,n=(s()-t.startTime)/r;c=n=n>1?1:n,l=.5*(1-Math.cos(Math.PI*c)),e=t.startX+(t.x-t.startX)*l,i=t.startY+(t.y-t.startY)*l,t.method.call(t.scrollable,e,i),e===t.x&&i===t.y||o.requestAnimationFrame(d.bind(o,t))}function h(l,e,r){var c,f,p,a,h=s();l===t.body?(c=o,f=o.scrollX||o.pageXOffset,p=o.scrollY||o.pageYOffset,a=i.scroll):(c=l,f=l.scrollLeft,p=l.scrollTop,a=n),d({scrollable:c,method:a,startTime:h,startX:f,startY:p,x:e,y:r})}}"object"==typeof exports&&"undefined"!=typeof module?module.exports={polyfill:o}:o()}();
class AnnouncementBar extends HTMLElement {
	constructor(){
		super();
		if ( document.querySelector('.announcement__exit') ) {
			document.querySelector('.announcement__exit').addEventListener('click', ()=>{
				document.body.classList.add('no-transition');
				setTimeout(()=>{
					document.body.classList.remove('show-announcement-bar');
					localStorage.setItem('announcement-dismissed', 'true');
					setTimeout(()=>{
						document.body.classList.remove('no-transitions');
					}, 100);
				}, 10)
			})
		}

	}
}
customElements.define('announcement-bar', AnnouncementBar);

// Shopify events

const toggleAnnouncement = e=>{
	const section = e.target;
	if ( section.classList.contains('mount-announcement') ) {
		if ( document.querySelector('.announcement') ) {
			document.body.classList.add('show-announcement-bar');
		} else {
			document.body.classList.remove('show-announcement-bar');
		}
	} 
}
document.addEventListener('shopify:section:load', toggleAnnouncement);
document.addEventListener('shopify:section:select', toggleAnnouncement);
class CartForm extends HTMLElement {

	constructor(){
		super();
		this.ajaxifyCartItems();
	}

	ajaxifyCartItems(){

		this.form = this.querySelector('form');

		this.querySelectorAll('.cart-item').forEach(item=>{

			const remove = item.querySelector('.remove');
			if ( remove ) {
				remove.dataset.href = remove.getAttribute('href');
				remove.setAttribute('href', '');
				remove.addEventListener('click', (e)=>{
					e.preventDefault();
					this.updateCartQty(item, 0);
				})
			}

			const qty = item.querySelector('.qty');
			if ( qty ) {
				qty.addEventListener('input', debounce(e=>{
					e.preventDefault();
					e.target.blur();
					this.updateCartQty(item, parseInt(qty.value));
				}, 300));
				qty.addEventListener('click', (e)=>{
					e.target.select();
				})
			}

		})

	}

	updateCartQty(item, newQty){

		this.form.classList.add('processing');
		if ( this.querySelector('.alert') ) {
			this.querySelector('.alert').remove();
		}

    const body = JSON.stringify({
      id: item.dataset.id,
      quantity: newQty
    });

		fetch(KROWN.settings.routes.cart_change_url, {
    		method: 'POST',
    		headers: { 'Content-Type': 'application/json', 'Accept': 'application/javascript' },
    		body
    	})
      .then(response => {
      	if ( response.ok ) {
      		return fetch('?section_id=cart-helper')
      	} else {
      		throw new Error('Something went wrong');
      	}
      })
      .then(response => response.text())
      .then(text => {

        const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html');
        const cartFormInnerHTML = sectionInnerHTML.getElementById('AjaxCartForm').innerHTML;
        const cartSubtotalInnerHTML = sectionInnerHTML.getElementById('AjaxCartSubtotal').innerHTML;

        const cartItems = document.getElementById('AjaxCartForm');
        cartItems.innerHTML = cartFormInnerHTML;
        cartItems.ajaxifyCartItems();
        document.querySelector('[data-header-cart-count]').textContent = cartItems.querySelector('[data-cart-count]').textContent;
        
        if ( newQty != 0 && cartItems.querySelector(`.cart-item[data-id="${item.dataset.id}"]`) && newQty > parseInt(cartItems.querySelector(`.cart-item[data-id="${item.dataset.id}"]`).dataset.qty) ) {
	        let alert = document.createElement('span');
	        alert.classList.add('alert', 'alert--error');
	        alert.textContent = KROWN.settings.locales.cart_add_error.replace('{{ title }}', item.dataset.title);
	        this.form.prepend(alert);
        } 

        document.getElementById('AjaxCartSubtotal').innerHTML = cartSubtotalInnerHTML;
    		window.preloadImages(cartItems);

      })
      .catch(e => {
      	console.log(e);
        let alert = document.createElement('span');
        alert.classList.add('alert', 'alert--error');
        alert.textContent = KROWN.settings.locales.cart_general_error;
        this.form.prepend(alert);
      })
      .finally(() => {
				this.form.classList.remove('processing');
      });
	}

} 

customElements.define('cart-form', CartForm);
class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.filterData = [];
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));

    if ( ! this.classList.contains('don-t-duplicate') ) {

      document.getElementById('FacetFiltersFormMobile').innerHTML = document.getElementById('FacetFiltersForm').innerHTML;
      document.getElementById('FacetFiltersFormMobile').addEventListener('input', this.debouncedOnSubmit.bind(this));
      document.getElementById('FacetFiltersFormMobile').querySelectorAll('.facets__item').forEach(elm=>{
        const id = elm.querySelector('input').id;
        elm.querySelector('label').setAttribute('for', `mobile-${id}`);
        elm.querySelector('input').id = `mobile-${id}`;
      });
      document.getElementById('FacetFiltersFormMobile').querySelector('.active-facets').classList.remove('active-facets-desktop')
      document.getElementById('FacetFiltersFormMobile').querySelector('.active-facets').classList.add('active-facets-mobile');
    }

  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    }
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();
    document.getElementById('main-collection-product-grid').classList.add('loading');
    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;
      FacetFiltersForm.filterData.some(filterDataUrl) ?
        FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) :
        FacetFiltersForm.renderSectionFromFetch(url, event);
    });
    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGrid(html);
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGrid(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;
    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
    window.preloadImages(document.getElementById('CollectionProductGrid'));
  }

  static renderProductCount(html) {
    const countEl = new DOMParser().parseFromString(html, 'text/html').getElementById('CollectionProductCount');
    if ( countEl ) {
      document.getElementById('CollectionProductCount').innerHTML = countEl.innerHTML;
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter');
    const matchesIndex = (element) => {
      if ( event && event.target.closest('.js-filter') ) {
        return element.dataset.index === event.target.closest('.js-filter').dataset.index;
      }
    }
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);

    if (countsToRender) FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];
    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector('.active-facets');
      if (!activeFacetsElement) return;
      if ( document.querySelector(selector) )
        document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    })

    FacetFiltersForm.toggleActiveFacets(false);
  }

  static renderCounts(source, target) {
    const countElementSelectors = ['.facets__selected'];
    countElementSelectors.forEach((selector) => {
      const targetElement = target.querySelector(selector);
      const sourceElement = source.querySelector(selector);
      if (sourceElement && targetElement) {
        target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
      }
    });
  }


  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        id: 'main-collection-product-grid',
        section: document.getElementById('main-collection-product-grid').dataset.id,
      }
    ]
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();
    FacetFiltersForm.renderPage(searchParams, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    FacetFiltersForm.renderPage(new URL(event.currentTarget.href).searchParams.toString());
  }

}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
      form.onActiveFilterClick(event);
    });
  }
}

customElements.define('facet-remove', FacetRemove);

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input')
      .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));

    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);
class LocalizationForm extends HTMLElement {

	constructor(){

		super();

		this.selector = this.querySelector('.regular-select-cover');
		this.content = this.querySelector('.regular-select-content');

		this.selector.addEventListener('click', e=>{

			e.stopPropagation();
			e.preventDefault();

			document.querySelectorAll('.regular-select-cover.content-opened').forEach(elm=>{
				if ( elm != e.currentTarget ) {
					elm.classList.remove('content-opened');
					elm.parentNode.style.zIndex = 9;
				}
			});

			if ( ! this.content.classList.contains('content-opened') ) {

				this.content.classList.add('content-opened');
				e.currentTarget.setAttribute('aria-expanded', 'true');
				this.content.parentNode.style.zIndex = 1000;;

				if ( this.content.classList.contains('invert-with-fixed') ) {
					if ( this.content.getBoundingClientRect().y + this.content.offsetHeight + 55 > window.innerHeight ) {
						this.content.classList.add('invert');
					}
				}

				this.onClickHandler = (()=>{
					if ( this.content.classList.contains('content-opened') ) {
						this.content.classList.remove('content-opened', 'invert');
						this.content.parentNode.style.zIndex = 9;
					}
				}).bind(this);
				window.addEventListener('click', this.onClickHandler);

			} else {
				e.currentTarget.setAttribute('aria-expanded', 'false');
				this.content.parentNode.style.zIndex = 9;
				this.content.classList.remove('content-opened', 'invert');
				window.removeEventListener('click', this.onClickHandler);
			}

		});

		this.querySelector('.regular-select-cover').addEventListener('keydown', function(e){
			if ( e.keyCode == window.KEYCODES.RETURN ) {
				if ( ! this.content.classList.contains('opened-with-tab') ) {
					this.content.classList.add('opened-with-tab');
					this.content.querySelectorAll('.regular-select-item').forEach(elm=>{elm.setAttribute('tabindex', '0')});
				}
			}
		});

	}

}

customElements.define('localization-form', LocalizationForm);
class ModalBox extends HTMLElement {

	constructor() {

		super();

		this.o = {
			...{
				show: 10, 
				frequency: 'day', 
				enabled: true
			}, ...JSON.parse(this.dataset.options)
		};
		
		this._modalKey = `modal-${document.location.hostname}-${this.id}`;
		this._modalStorage = ! localStorage.getItem(this._modalKey) ? 'empty' : JSON.parse(localStorage.getItem(this._modalKey));
		this._modalText = this.extractText(this.querySelector('[data-content]'));

		if ( this.o.enabled ) {

			const timeNow = new Date().getTime();
			const inBetween = Math.round((timeNow - this._modalStorage['shown']) / 1000);

			let showModal = false;

			if ( this._modalStorage == 'empty'
				|| ( this.o.frequency == 'day' && inBetween > 86400 )
				|| ( this.o.frequency == 'week' && inBetween > 604800 )
				|| ( this.o.frequency == 'month' && inBetween > 2419200 )
				|| this._modalStorage['content'] != this._modalText
			 ) {
				showModal = true
			}

			if ( showModal ) {
				this._modalTimeout = setTimeout(()=>{
					this.show();
				}, parseInt(this.o.show*1000));
				setTimeout(()=>{
					this.querySelectorAll('[data-close]').forEach(elm=>elm.addEventListener('click',()=>{this.hide(true)}));
				}, 100);
			}

		}
		
		this.setAttribute('style', '');

	}

	show(){
		window.preloadImages(this);
		this.classList.add('active');
	}
	hide(remember=false){
		this.classList.remove('active');
		if ( remember && ! Shopify.designMode ){
			localStorage.setItem(this._modalKey, JSON.stringify({
				'shown': (new Date().getTime()),
				'content': this._modalText
			}));
		}
	}

	extractText(content){
	  let span = document.createElement('span');
	  span.innerHTML= content.innerHTML;
	  const returnText = span.textContent || span.innerText;
	  span.remove();
	  return [returnText].toString().replace(/ +/g,'');
	}

}
customElements.define('modal-box', ModalBox);

// Shopify events

document.addEventListener('shopify:section:select', (e)=>{
	if ( e.target.classList.contains('mount-popup') ) {
		e.target.querySelector('modal-box').show();
	}
});
document.addEventListener('shopify:section:deselect', (e)=>{
	if ( e.target.classList.contains('mount-popup') ) {
		e.target.querySelector('modal-box').hide();
	}
});
class ProductVariants extends HTMLElement {

	constructor() {

		super();
		this.price = document.querySelector(`#product-price-${this.dataset.id}`);

		if ( this.price ) {
			this.priceOriginal = this.price.querySelector('.product__price--original');
			this.priceCompare = this.price.querySelector('.product__price--compare');
			this.priceUnit = this.price.querySelector('.product__price--unit');
		}

		this.productForm = document.querySelector(`#product-form-${this.dataset.id}`);
		if ( this.productForm ) {
			this.productQty = this.productForm.querySelector('.product__quantity');
			this.addToCart = this.productForm.querySelector('.product__add-to-cart');
			this.addToCartText = this.productForm.querySelector('.add-to-cart__text');
		}

		this.addEventListener('change', this.onVariantChange);

		this.updateOptions();
		this.updateMasterId();
		this.updateUnavailableVariants();

		this.productStock = this.querySelector('.variant-quantity');
		if ( this.productStock && this.querySelector('.variant-quantity-data') ) {
			this.productStockData = JSON.parse(this.querySelector('.variant-quantity-data').dataset.inventory);
		}
		this.updateStock();

    this._event = new Event('VARIANT_CHANGE');

	}

	onVariantChange(){

    this.updateOptions();
    this.updateMasterId();
    this.updateVariantInput();
    if ( this.price ) {
    	this.updatePrice();
    }
    this.updateStock();
		this.updateUnavailableVariants();
		this.updatePickupAvailability();
    if ( ! this.hasAttribute('data-no-history') ) {
      this.updateURL();
    }
    this.updateDetails();

    if ( this.productForm ) {
	    if ( ! this.currentVariant || ! this.currentVariant.available ) {
        if ( this.productQty ) this.productQty.style.display = 'none';
	  		this.addToCart.classList.add('disabled');
        this.productForm.classList.add('disabled-cart');
	  		this.addToCartText.textContent = KROWN.settings.locales.products_sold_out_variant;
	    } else {
        if ( this.productQty ) this.productQty.style.display = '';
	  		this.addToCart.classList.remove('disabled');
        this.productForm.classList.remove('disabled-cart');
	  		this.addToCartText.textContent = KROWN.settings.locales.products_add_to_cart_button;
	    }
	    if ( ! this.currentVariant ) {
	    	this.productForm.classList.add('unavailable-variant');
	  		this.addToCartText.textContent = KROWN.settings.locales.products_unavailable_variant;
	    } else {
	    	this.productForm.classList.remove('unavailable-variant');
	    }
	  }

    this.dispatchEvent(this._event);

	}

	updateOptions(){
  	if ( this.dataset.type == 'select' ) {
    	this.options = Array.from(this.querySelectorAll('.product-variant-container'), (select) => select.value);
  	} else if ( this.dataset.type == 'radio' ) {
  		this.options = [];
  		this.querySelectorAll('.product-variant__input').forEach(elm=>{
  			if ( elm.checked ) 
  				this.options.push(elm.value);
  		});
  	}
	}

  updateMasterId(){
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updatePrice(){
    
    if (!this.currentVariant) {
    	this.priceOriginal.innerHTML = '';
			this.priceCompare.style.display = 'none';
			this.priceUnit.innerHTML = '';
    } else {
			this.priceOriginal.innerHTML = KROWN.helpers.formatMoney(this.currentVariant.price, KROWN.settings.shop_money_format);
			if ( this.currentVariant.compare_at_price > this.currentVariant.price ) {
				this.priceCompare.innerHTML = KROWN.helpers.formatMoney(this.currentVariant.compare_at_price, KROWN.settings.shop_money_format);
				this.priceCompare.style.display = '';
			} else {
				this.priceCompare.style.display = 'none';
			}

			if ( this.currentVariant.unit_price_measurement ) {
				this.priceUnit.innerHTML = `
					${KROWN.helpers.formatMoney(this.currentVariant.unit_price, KROWN.settings.shop_money_format)} / 
					${( this.currentVariant.unit_price_measurement.reference_value != 1 ? this.currentVariant.unit_price_measurement.reference_value + ' ' : '' )}
					${this.currentVariant.unit_price_measurement.reference_unit}
				`;
			} else {
				this.priceUnit.innerHTML = '';
			}
    }
  
  }

  updateStock(){
    if (!this.currentVariant) {
    	if ( this.productStock )
  		this.productStock.innerHTML = '';
    } else {
			if ( this.productStock && this.productStockData ) {
	  		let currentVariant = false;
	  		for ( const variant of this.productStockData ) {
	  			if ( variant.id == this.currentVariant.id ) {
	  				currentVariant = variant;
	  				break;
	  			}
	  		}
	  		this.productStock.innerHTML = '';
	  		if ( currentVariant ) {
		  		if ( currentVariant.quantity <= 0 ) {
						if ( currentVariant.inventory == 'continue' ) {
							this.productStock.innerHTML = KROWN.settings.locales.products_preorder;
						} else if ( currentVariant.inventory == 'deny' ) {
							this.productStock.innerHTML = KROWN.settings.locales.products_no_products;
						}
					} else if ( currentVariant.quantity == '1' ) {
						this.productStock.innerHTML = KROWN.settings.locales.products_one_product;
					} else if ( currentVariant.quantity <= 5 ) {
						this.productStock.innerHTML = KROWN.settings.locales.products_few_products.replace('{{ count }}', currentVariant.quantity);
					} else if ( currentVariant.unavailable ) {
						this.productStock.innerHTML = KROWN.settings.locales.products_no_products;
					} else if ( currentVariant.quantity > 5 && this.productStock.dataset.type == "always" ) {
						this.productStock.innerHTML = KROWN.settings.locales.products_few_products.replace('{{ count }}', currentVariant.quantity);
					}
	  		}
	  	}
    }
  }

  updateDetails(){

    document.querySelectorAll(`#product-${this.dataset.id} .product__sku`).forEach(elm=>{
      if ( this.currentVariant.sku ) {
        elm.innerHTML = KROWN.settings.locales.product_sku + this.currentVariant.sku;
      } else {
        elm.innerHTML = '';
      }
    });

    document.querySelectorAll(`#product-${this.dataset.id} .product__barcode`).forEach(elm=>{
      if ( this.currentVariant.barcode ) {
        elm.innerHTML = KROWN.settings.locales.product_sku + this.currentVariant.barcode;
      } else {
        elm.innerHTML = '';
      }
    });
    
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  updateUnavailableVariants(){

		if ( this.dataset.hideVariants == 'true' ) {

   		let options1 = {},
	        options2 = {},
	        options3 = {},

	        option1Selected = null,
	        option2Selected = null;

			if ( this.dataset.variants > 1 ) {
				option1Selected = this._getSelectedOption(0);
				this._resetDisabledOption(1);
      }
      if ( this.dataset.variants > 2 ) {
				option2Selected = this._getSelectedOption(1);
				this._resetDisabledOption(2);
      }

      this.getVariantData().forEach((el) => {

      	 if ( this.dataset.variants > 0 ) {
          if ( ! options1[el.option1] ) {
            options1[el.option1] = [];
          }
          options1[el.option1].push(String(el.available));
        }
        if ( this.dataset.variants > 1 ) {
          if ( ! options2[el.option2] ) {
            options2[el.option2] = [];
          }
          options2[el.option2].push(String(el.available));
        }
        if ( this.dataset.variants == 2 ) {
          if ( el.option1 == option1Selected && ! el.available ) {
          	this._setDisabledOption(1, el.option2);
          }
        }
        if ( this.dataset.variants > 2 ) {
          if ( ! options3[el.option3] ) {
            options3[el.option3] = [];
          }
          options3[el.option3].push(String(el.available));
          if ( el.option2 == option2Selected && el.option1 == option1Selected && ! el.available ) {
          	this._setDisabledOption(2, el.option3);
          }
        }

      });

      if ( this.dataset.variants > 0 ) {
        Object.keys(options1).forEach((key)=>{
          if ( ! options1[key].includes('true') ){
            this.querySelectorAll('.product-variant')[0].querySelector(`.product-variant-value[value="${key}"]`).setAttribute('disabled', 'disabled');
          }
        });
      }
      if ( this.dataset.variants > 1 ) {
        Object.keys(options2).forEach((key)=>{
          if ( ! options2[key].includes('true') ){
            this.querySelectorAll('.product-variant')[1].querySelector(`.product-variant-value[value="${key}"]`).setAttribute('disabled', 'disabled');
          }
        });
      }
      if ( this.dataset.variants > 2 ) {
        Object.keys(options3).forEach((key)=>{
          if ( ! options3[key].includes('true') ){
            this.querySelectorAll('.product-variant')[2].querySelector(`.product-variant-value[value="${key}"]`).setAttribute('disabled', 'disabled');
          }
        });
        Object.keys(options2).forEach((key)=>{
          if ( ! options2[key].includes('true') ){
            if ( option2Selected == key ) {
              this.querySelectorAll('.product-variant')[2].querySelector('.product-variant-value').setAttribute('disabled', 'disabled');
            }
          }
        });
      }

		}
  }

  _getSelectedOption(i){
  	if ( this.dataset.type == 'select' ) {
  		return this.querySelectorAll('.product-variant')[i].querySelector('.product-variant-container').value;
  	} else if ( this.dataset.type == 'radio' ) {
  		let selectedOption = null;
  		this.querySelectorAll('.product-variant')[i].querySelectorAll('.product-variant__input').forEach(elm=>{ if (elm.checked) selectedOption = elm.value });
  		return selectedOption;
  	}
  }

  _resetDisabledOption(i){
		this.querySelectorAll('.product-variant')[i].querySelectorAll('.product-variant-value').forEach((elm)=>{
			elm.removeAttribute('disabled');
		})
  }

  _setDisabledOption(i,option){
    this.querySelectorAll('.product-variant')[i].querySelector(`.product-variant-value[value="${option}"]`).setAttribute('disabled', 'disabled')
  }

  updateURL(){
    if (!this.currentVariant) return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    if (!this.currentVariant) return;
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.id}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  getVariantData(){
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

}

customElements.define('product-variants', ProductVariants);

/* ---
	Product Form
--- */

class ProductForm extends HTMLElement {
  constructor() {
    super();   
    this.init();
  }

  init(){
    if ( this.hasAttribute('data-ajax-cart') && ! document.body.classList.contains('template-cart') ) {
      this.form = this.querySelector('form');
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.ADD_TO_CART = new Event('add-to-cart');
    }
  }

  onSubmitHandler(e) {

    e.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');

    submitButton.classList.add('working');

    const body = serializeForm(this.form);
    let alert = '';

    fetch(`${KROWN.settings.routes.cart_add_url}.js`, {
    	body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: 'POST'
    })
      .then(response => response.json())
      .then(response => {
    		if ( response.status == 422 ) {
    			// wrong stock logic alert
    			alert = document.createElement('span');
    			alert.className = 'alert body-text-sm alert--error';
    			alert.innerHTML = response.description
    			return fetch('?section_id=cart-helper');
    		} else {
    			return fetch('?section_id=cart-helper');
    		}
      })
      .then(response => response.text())
			.then(text => {

        const sectionInnerHTML = new DOMParser().parseFromString(text, 'text/html');
        const cartFormInnerHTML = sectionInnerHTML.getElementById('AjaxCartForm').innerHTML;
        const cartSubtotalInnerHTML = sectionInnerHTML.getElementById('AjaxCartSubtotal').innerHTML;

        const cartItems = document.getElementById('AjaxCartForm');
        cartItems.innerHTML = cartFormInnerHTML;
        cartItems.ajaxifyCartItems();

        if ( alert != '' ) {
    			document.getElementById('AjaxCartForm').querySelector('form').prepend(alert);
        }

        document.getElementById('AjaxCartSubtotal').innerHTML = cartSubtotalInnerHTML;
    		window.preloadImages(cartItems);

        document.querySelector('[data-header-cart-count]').textContent = document.querySelector('#AjaxCartForm [data-cart-count]').textContent;
        this.dispatchEvent(this.ADD_TO_CART);

      })
      .catch(e => {
      	console.log(e);
      })
      .finally(() => {
      	submitButton.classList.remove('working');
      });
  }
}

customElements.define('product-form', ProductForm);


/* ---
	Pickup availability
--- */

class PickupAvailability extends HTMLElement {

	constructor(){
		super();
    this.errorHtml = this.querySelector('template').content.firstElementChild.cloneNode(true);
    this.onClickRefreshList = this.onClickRefreshList.bind(this);
    if(!this.hasAttribute('available')) return;
    this.fetchAvailability(this.dataset.variantId);
	}

  fetchAvailability(variantId) {

    const variantSectionUrl = `${this.dataset.baseUrl}variants/${variantId}/?section_id=pickup-availability`;

    fetch(variantSectionUrl)
      .then(response => response.text())
      .then(text => {
        const sectionInnerHTML = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('.shopify-section');
        this.renderPreview(sectionInnerHTML);
      })
      .catch(e => {
      	console.log(e);
        if ( this.querySelector('button') ) {
          this.querySelector('button').removeEventListener('click', this.onClickRefreshList);
        }
        this.renderError();
      });

  }

  onClickRefreshList() {
    this.fetchAvailability(this.dataset.variantId);
  }

  renderError() {
    this.innerHTML = '';
    this.appendChild(this.errorHtml);
    this.querySelector('button').addEventListener('click', this.onClickRefreshList);
  }

  renderPreview(sectionInnerHTML){
  	
	  const drawer = document.getElementById('PickupAvailabilityDrawer');
	  if (drawer) drawer.remove();

	  if (!sectionInnerHTML.querySelector('pickup-availability-preview')) {
	    this.innerHTML = "";
	    this.removeAttribute('available');
	    return;
	  }

    this.innerHTML = sectionInnerHTML.querySelector('pickup-availability-preview').outerHTML;
    this.setAttribute('available', '');
    document.body.appendChild(sectionInnerHTML.querySelector('#PickupAvailabilityDrawer'));

    this.querySelector('button').addEventListener('click', (evt) => {
      document.getElementById('PickupAvailabilityDrawer').show(evt.target);
    });
    this.querySelector('button').addEventListener('keyup', e=>{
      if ( e.keyCode == window.KEYCODES.RETURN ) {
        document.getElementById('PickupAvailabilityDrawer').querySelector('[data-close]').focus();
      }
    })

	}

}
customElements.define('pickup-availability', PickupAvailability);

/* ---
	Product Image Zoom
--- */

class ProductImageZoom extends HTMLElement {

	constructor(){

		super();

		if ( ! document.getElementById('zoom') ) {
			this.zoom = document.createElement('div');
			this.zoom.id = 'zoom';
			this.zoom.innerHTML = `
				<img />
				<span class="zoom__exit">${KROWN.settings.symbols.zoom_out}</span>
				<div class="zoom__overlay"></div>
			`;
			document.body.append(this.zoom);
			this.zoom.querySelector('.zoom__exit').addEventListener('click', this._productZoomUnmount.bind(this));
		} else {
			this.zoom = document.getElementById('zoom');
		}

		this.onMouseMoveHandlerBinded = this.onMouseMoveHandler.bind(this);
		this.onResizeHandlerBinded = this.onResizeHandler.bind(this);

		this.addEventListener('click', (e)=>{
			this.zoom.classList.add('opened');
			this.image = this.zoom.querySelector('img');
			this.image.src = this.getAttribute('data-image');
			if ( this.image.naturalWidth > 0 ) {
				this._productZoomMount();
			} else {
				this.image.addEventListener('load', this._productZoomMount.bind(this));
			}
		});

	}

	onMouseMoveHandler(e){
		window.clientX = e.clientX;
		window.clientY = e.clientY;
		const x = e.clientX * ( window.innerWidth - this.image.offsetWidth ) / window.innerWidth;
		const y = e.clientY * ( window.innerHeight - this.image.offsetHeight ) / window.innerHeight;
		this.image.style.left = x + 'px';
		this.image.style.top = y + 'px';
	}

	onResizeHandler(){

		const rf = window.innerWidth > 768 ? 1 : 2;

		if ( this.image.classList.contains('portrait') ) {
			this.image.style.width = ( window.innerWidth*rf ) + 'px';
			this.image.style.height = ( window.innerWidth*rf / this.image.dataset.ratio ) + 'px';
		} else {

			this.image.style.height = ( window.innerHeight*rf ) + 'px';
			this.image.style.width = ( window.innerHeight*rf * this.image.dataset.ratio ) + 'px';

			if ( this.image.offsetWidth < window.innerWidth ) {
				this.image.style.width = ( window.innerWidth*rf ) + 'px';
				this.image.style.height = ( window.innerWidth*rf / this.image.dataset.ratio ) + 'px';
			}

		}

		const x = window.clientX * ( window.innerWidth - this.image.offsetWidth ) / window.innerWidth;
		const y = window.clientY * ( window.innerHeight - this.image.offsetHeight ) / window.innerHeight;

	}

	_productZoomMount(image) {

		this.image.style.left = 0;
		this.image.style.top = 0;

		window.addEventListener('mousemove', this.onMouseMoveHandlerBinded, {passive:true});

		this.image.dataset.ratio = this.image.naturalWidth / this.image.naturalHeight;
		window.addEventListener('resize', this.onResizeHandlerBinded, {passive:true});
		this.onResizeHandler();

		setTimeout(()=>{
			if ( document.body.classList.contains('touch') || document.body.classList.contains('touchevents') ) {
				this.zoom.scrollTop = ( window.innerHeight - this.image.offsetHeight ) / -2;
				this.zoom.scrollLeft = ( window.innerWidth - this.image.offsetWidth ) / -2;
			}
			this.zoom.classList.add('loaded');
		}, 50);

	}

	_productZoomUnmount() {

		this.zoom.classList.remove('opened');

		setTimeout(()=>{
			window.removeEventListener('resize', this.onResizeHandlerBinded);
			window.removeEventListener('mousemove', this.onMouseMoveHandlerBinded);
      const image = document.querySelector('#zoom img');
			image.src = '';
			image.className = '';
			image.style = '';
			this.zoom.classList.remove('loaded');
		}, 300);

	}

}

customElements.define('product-image-zoom', ProductImageZoom);


/* ---
	Product Recommendations
--- */

if ( typeof ProductRecommendations !== 'function' ) {

	class ProductRecommendations extends HTMLElement {
		constructor() {

			super();  
      
      const event = new Event('product-recommendations-loaded');

      const handleIntersection = (entries, observer) => {

        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        fetch(this.dataset.url)
          .then(response => response.text())
          .then(text => {
            const innerHTML = new DOMParser()
                .parseFromString(text, 'text/html')
                .querySelector('product-recommendations');
                
            if ( innerHTML && innerHTML.querySelectorAll('[data-js-product-item]').length > 0 ) {
              this.innerHTML = innerHTML.innerHTML;
              this.querySelectorAll('form').forEach(elm=>{
                if (elm.querySelector('template')) {
                  elm.append(elm.querySelector('template').content.cloneNode(true));
                }
              });
              this.dispatchEvent(event);
            }
          })
          .catch(e => {
            console.error(e);
          });
      }

			new IntersectionObserver(handleIntersection.bind(this), {rootMargin: `0px 0px 400px 0px`}).observe(this);

		}

	}
	
  if ( typeof customElements.get('product-recommendations') == 'undefined' ) {
		customElements.define('product-recommendations', ProductRecommendations);
	}

}
class SearchForm extends HTMLElement {

	constructor() {

		super();	
    this.cachedResults = {};
		this.input = this.querySelector('[data-search-input]');
    this.predictiveSearchResults = this.querySelector('[data-search-results]');
    this.results = [];
    this.preloader = false;

		if ( KROWN.settings.predictive_search_enabled != "false" ) {

			let inputValue = this.input.value;
			this.input.addEventListener('keyup', debounce(e=>{
				if ( this.input.value != inputValue ) {
					inputValue = this.input.value;
					this.getSearchResults(this.input.value.trim());
				} else if ( this.input.value == '' ) {
					this.clearSearchResults();
				}
			},150));

			this.input.addEventListener('keydown', e=>{
				if ( this.a11yIndex != -1 ) {
		    	if (
			      e.keyCode === window.KEYCODES.UP ||
			      e.keyCode === window.KEYCODES.DOWN ||
			      e.keyCode === window.KEYCODES.RETURN
			    ) {
			      e.preventDefault();
			    }
		    }
			});

			this.input.addEventListener('keyup', e=>{
				if (e.keyCode === window.KEYCODES.UP) {
	        this.navigateThrough('UP');
	        return true;
	      }

	      if (e.keyCode === window.KEYCODES.DOWN) {
	        this.navigateThrough('DOWN');
	        return true;
	      }

	      if (e.keyCode === window.KEYCODES.RETURN) {
	      	if ( this.a11yIndex != -1 ) {
	      		document.location.href = this.results[this.a11yIndex].querySelector('a');
	      	}
	      }
			})

		}

	}

	getSearchResults(query="") {

		this.preloadSearchResults();

    const queryKey = query.replace(" ", "-").toLowerCase();
    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

	  this.a11yIndex = -1;

    fetch(`${KROWN.settings.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=${this.dataset.resourceType}&resources[limit]=4&section_id=predictive-search`)
    	.then(response=>{
        if (!response.ok) {
          var error = new Error(response.status);
          this.clearSearchResults();
          throw error;
        }
        return response.text();
    	})
    	.then(text=>{
    		const results = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
    		this.cachedResults[queryKey] = results;
    		this.renderSearchResults(results);
    	})	
      .catch((e) => {
        throw e;
    	}); 

	}

	clearSearchResults(){
		this.predictiveSearchResults.innerHTML = '';
		this.preloader = false;
    this.results = [];
	}

	preloadSearchResults(){
		if ( ! this.preloader ) {
			this.preloader = true;
			this.predictiveSearchResults.innerHTML = KROWN.settings.predictive_search_placeholder;
		}
	}

	renderSearchResults(results){
    this.predictiveSearchResults.innerHTML = results;
		this.preloader = false;
    this.results = this.predictiveSearchResults.querySelectorAll('.search-item, .sidebar__search-link');
		window.preloadImages(this.predictiveSearchResults);
	}

	navigateThrough(direction){

		if ( this.a11yIndex == -1 ) {
			this.a11yIndex = 0;
		} else {
			this.results[this.a11yIndex].classList.remove('active');
			if ( direction == 'UP' ) {
				if ( this.a11yIndex - 1 >= -1 ) {
					this.a11yIndex--;
				} 
			} else if ( direction == 'DOWN' ) {
				if ( this.a11yIndex + 1 < this.results.length ) {
					this.a11yIndex++;
				} 
			}
		}

		if ( this.a11yIndex >= 0 ) {
			this.results[this.a11yIndex].classList.add('active');
			document.getElementById('site-search-sidebar').scrollTop = this.results[this.a11yIndex].offsetTop - 200;
		} else {
			document.getElementById('site-search-sidebar').scrollTop = 0;
		}

	}

}
customElements.define('search-form', SearchForm);
class CSSSlider extends HTMLElement {

	constructor(){

		super();

    this._touchScreen = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
    const ua = navigator.userAgent.toLowerCase();
    this._ios15 = this._touchScreen && ua.includes('applewebkit') && ( ua.includes('os 15_') || ua.includes('version/15') );

		// create option object, from defaults
		this.o = {
			...{
				selector: '.css-slide', 
				snapping: true, 
        groupCells: false,
				autoHeight: false, 
				navigation: true,
				navigationDOM: `<span class="css-slider-button css-slider-prev" style="display:none">←</span>
					<span class="css-slider-button css-slider-next" style="display:none">→</span>`,
        thumbnails: true,
        thumbnailsDOM: `<div class="css-slider-dot-navigation" style="display:none"></div>`,
        indexNav: false,
        indexNavDOM: `<div class="css-slider-index-navigation"><span class="css-slider-current">1</span> / <span class="css-slider-total">1</span></div>`,
        watchCSS: false,
        undisplay: false,
        listenScroll: false
			}, ...JSON.parse(this.dataset.options)
		};

    // init slider or watch for css
    if ( ! this.o.watchCSS ) {
      this.initSlider();
    } else {
      this.RESIZE_WATCHER = debounce(()=>{
        const afterContent = window.getComputedStyle(this,':after').content;
        if ( afterContent.includes('css-slide') && !this.sliderEnabled ) {
          this.initSlider();
        } else if ( !afterContent.includes('css-slide') && this.sliderEnabled )  { 
          this.destroySlider();
        }
      }, 100);
      window.addEventListener('resize', this.RESIZE_WATCHER);
      this.RESIZE_WATCHER();
    }

	
	}

  destroySlider(){
    this.innerHTML = `${this.originalHTML}`;
    this.classList.remove('enabled');
    this.sliderEnabled = false;
    window.removeEventListener('resize', this.RESIZE_EVENT);
    window.removeEventListener('scroll', this.SCROLL_EVENT);
    window.removeEventListener('scroll', this.SCROLL_EVENT_ANIMATION);
    window.preloadImages(this);
  }

  initSlider(){

    // create custom events

    this._readyEvent = new CustomEvent('ready');
    this._changeEvent = new CustomEvent('change');
    this._scrollEvent = new CustomEvent('scroll');
    this._navEvent = new CustomEvent('navigation');
    this._pointerDownEvent = new CustomEvent('pointerDown');
    this._pointerUpEvent = new CustomEvent('pointerUp');

    // create slider structure

    this.classList.add('css-slider');
    this.originalHTML = this.innerHTML;
    this.innerHTML = `<div class="css-slider-viewport">
      <div class="css-slider-holder">
        <div class="css-slider-container">
          ${this.originalHTML}
        </div>
      </div>
    </div>`;

    window.preloadImages(this);
    
    // add css-slide to children, if it's not set

    if ( this.o.undisplay ) {
      this.querySelectorAll(`${this.o.selector}`).forEach((elm)=>{
        elm.style.display = 'block';
      })
    }

    if ( this.o.selector != '.css-slide' ) {
      this.querySelectorAll(`${this.o.selector}`).forEach((elm)=>{
        elm.classList.add('css-slide');
      })
    }

    // setup variables

    this.element = this.querySelector('.css-slider-holder');
    if ( this.o.groupCells ) {
      this.element.scrollLeft = 0;
    }

    this.items = this.querySelectorAll(`${this.o.selector}`);
    this.indexedItems = [];
    this.index = 0;
    this.length = this.items.length;
    this.windowWidth = window.innerWidth;

    this.querySelector('.css-slider-container').addEventListener('mousedown', e=>{
      e.preventDefault();
    });
    
    this.viewport = this.querySelector('.css-slider-viewport');
    if ( this.o.autoHeight ) {
      this.viewport.classList.add('auto-height');
    }

    // append navigation

    if ( this.o.navigation || this.o.thumbnails || this.indexNav ) {

      let container = document.createElement('div');
      container.classList.add('css-slider-navigation-container');
      container.innerHTML = `
        ${(this.o.navigation ? this.o.navigationDOM : '')}
        ${(this.o.thumbnails ? this.o.thumbnailsDOM : '')}
        ${(this.o.indexNav ? this.o.indexNavDOM : '')}`;

      if ( this.o.navigation ) {
        this.prevEl = container.querySelector('.css-slider-prev');
        this.prevEl.addEventListener('click', e=>{
          this.changeSlide('prev');
          this.dispatchEvent(this._navEvent);
        });
        this.nextEl = container.querySelector('.css-slider-next');
        this.nextEl.addEventListener('click', e=>{
          this.changeSlide('next');
          this.dispatchEvent(this._navEvent);
        });
      }

      if ( this.o.thumbnails ) {
        this.thumbnailsEl = container.querySelector('.css-slider-dot-navigation'); 
      }

      if ( this.o.indexNav ) {
        this.indexEl = container.querySelector('.css-slider-current');
        this.lengthEl = container.querySelector('.css-slider-total'); 
      }

      this.append(container);

    }

    if ( this.length > 1 ) {

      // observer for slides

      this.RESIZE_EVENT = debounce(()=>{
        if ( this.windowWidth != window.innerWidth && this.o.groupCells) {
          this.resetSlider();
        }
        if ( ! this.o.groupCells ) {
          this.checkSlide();
        }
        this.windowWidth = window.innerWidth;
      }, 100);
      window.addEventListener('resize', this.RESIZE_EVENT);
      this.resetSlider(true);    

      // dispatching scroll event, mostly for extra animations
      if ( this.o.listenScroll ) {
        this.SCROLL_EVENT_ANIMATIONS = (()=>{
          let slidesWidth = -this.querySelector('.css-slider-container').offsetWidth;
          this.items.forEach(elm=>{slidesWidth += elm.offsetWidth});
          this.progress = this.element.scrollLeft / slidesWidth;
          this.dispatchEvent(this._scrollEvent);
        });
        this.element.addEventListener('scroll', this.SCROLL_EVENT_ANIMATIONS, {passive:true});
      }

      this.SCROLL_EVENT = debounce(()=>{
        // checking selected index
        if ( ! this._sliderBlockScroll ) {
          const scrollItems = this.indexedItems.entries();
          const scrollArray = Array.from(scrollItems, elm => Math.abs(elm[1].offsetLeft-this.element.scrollLeft));
          const scrollDistance = Math.min(...scrollArray);
          const scrollIndex = scrollArray.indexOf(scrollDistance);
          /*if ( this.indexedItems[this.length-2].offsetLeft-this.element.scrollLeft < 0 ) {
            this.index = this.length - 1;
            this.checkSlide();
            this.dispatchEvent(this._changeEvent);
          } else */if ( scrollIndex != this.index ) {
            this.index = scrollIndex;
            this.checkSlide();
            this.dispatchEvent(this._changeEvent);
          }

        }
      }, 10);

      // mouse fallback for non-touch devices

      this.element.addEventListener('scroll', this.SCROLL_EVENT, {passive:true});

      if ( ! this._touchScreen && ! this.element.classList.contains('css-slider--singular') ) {
        this.element.addEventListener('mousedown', e=>{
          if ( ! this.element.classList.contains('css-slider--disable-dragging') ) {
            this.mouseX = e.screenX;
            this.element.classList.add('can-drag');
            this.element.classList.add('mouse-down');
          }
        });
        this.element.addEventListener('mouseup', e=>{
          this.element.classList.remove('mouse-down');
          this.element.classList.remove('can-drag');
          this.element.classList.remove('pointer-events-off');
        });

        this.element.addEventListener('mouseleave', e=>{
          this.element.classList.remove('mouse-down');
          this.element.classList.remove('can-drag');
          this.element.classList.remove('pointer-events-off');
        });

        this.element.addEventListener('mousemove', e=>{
          if ( this.element.classList.contains('can-drag') ) {
            this.element.classList.add('pointer-events-off');
            let direction = this.mouseX - e.screenX;
            if ( Math.abs(direction) > 1 ) {
              if ( direction > 0 ) {
                this.changeSlide('next');
                this.element.classList.remove('can-drag');
              } else if ( direction < 0 ) {
                this.changeSlide('prev');
                this.element.classList.remove('can-drag');
              }
            }
          }
        });

      }

      // helper for browser that don't support smooth scrolling

      if ( ! ( "scrollBehavior" in document.documentElement.style ) && ! this._touchScreen ) {
        this.element.classList.add('force-disable-snapping');
      }

    }

    // dispatch ready event

    this.classList.add('enabled');
    this.sliderEnabled = true;
    this.dispatchEvent(this._readyEvent);

  }

	changeSlide(direction, behavior='smooth'){

    // function that changes the slide, either by word (next/prev) or index

		if ( direction == 'next' ) {
      if ( this.index+1 < this.length ) {
        this.index++;
      }
    } else if ( direction == 'prev') {
      if ( this.index-1 >= 0 ) {
        this.index--;
      }
    } else if ( parseInt(direction) >= 0 ) {
      this.index = parseInt(direction);
    }

    this._sliderBlockScroll = true;
    if ( this._ios15 ) {
      this.element.classList.add('force-disable-snapping');
    }
    setTimeout(()=>{
      this._sliderBlockScroll = false;
      if ( this._ios15 ) {
        this.element.classList.remove('force-disable-snapping');
      }
    }, 500);

    this.checkSlide();

    this.element.scrollTo({
      top: 0,
      left: this.indexedItems[this.index].offsetLeft - parseInt(getComputedStyle(this.indexedItems[0]).marginLeft),
      behavior: behavior
    });
    this.dispatchEvent(this._changeEvent);

	}

	checkSlide(){  
    
    // checks slide after index change and updates navigation / viewport

    if ( this.o.navigation ) {
      this.prevEl.classList.remove('disabled');
      this.nextEl.classList.remove('disabled');
      if ( this.index == 0 ) {
        this.prevEl.classList.add('disabled');
      }
      if ( this.index == this.length - 1 ) {
        this.nextEl.classList.add('disabled');
      }
    }

    if ( this.o.thumbnails && this.thumbnails ) {
      this.thumbnails.forEach(elm=>{elm.classList.remove('active')});
      this.thumbnails[this.index].classList.add('active');
    }

    if ( this.o.indexNav ) {
      this.indexEl.textContent = this.index+1;
    }
		
    if ( this.o.autoHeight ) {
      this.viewport.style.height = this.indexedItems[this.index].offsetHeight + 'px';
    } 
    
    this.indexedItems.forEach((elm,i)=>{
      if ( i == this.index ) {
        elm.classList.add('css-slide-active');
      } else {
        elm.classList.remove('css-slide-active');
      }
    });

	}

	afterAppend(){
		this.items = this.querySelectorAll(`${this.o.selector}`);
	}

	resetSlider(nojump=false,resetIndex=true){

		let slidesWidth = 0,
        slidesPerPage = 0,
        page = 0,
        pages = 0,
        totalWidth = this.querySelector('.css-slider-container').offsetWidth,// - 20,
        hideNavigation = false;

    // reset entire slider

    this.indexedItems = [];
    this.element.classList.add('disable-snapping');

    // find out how many pages (slides there are now)

    this.items.forEach((elm, i)=>{
      elm.classList.remove('css-slide--snap');
      slidesWidth += elm.offsetWidth;
      if ( slidesWidth > totalWidth && slidesPerPage == 0 ) {
        slidesPerPage = i;
      }
    });

    if ( slidesPerPage == 0 ) {
      slidesPerPage = this.items.length;
      hideNavigation = true;
    }
    // set each slide for observer

    this.items.forEach((elm, i) => {
      if ( i % slidesPerPage == 0  ) {
        elm.classList.add('css-slide--snap');
        elm.setAttribute('data-index', page++);
      }
    });

    this.indexedItems = this.querySelectorAll('.css-slide--snap');
    if ( resetIndex ) {
      this.index = 0;
    }
    this.length = Math.ceil(this.items.length / slidesPerPage);

    // recreate navigation

    if ( this.o.thumbnails ) {
      this.thumbnailsEl.innerHTML = '';
      for ( let i = 0; i < this.length; i++ ) {
        let dot = document.createElement('span');
        dot.classList.add('css-slider-dot');
        dot.dataset.index = i;
        this.thumbnailsEl.appendChild(dot);
        dot.addEventListener('click', (e)=>{
          this.changeSlide(e.target.dataset.index);
        });
      }
      this.thumbnails = this.thumbnailsEl.querySelectorAll('.css-slider-dot');
    }

    if ( this.o.indexNav ) {
      this.indexEl.textContent = this.index+1;
      this.lengthEl.textContent = this.length;
    }

    // hide navigation if only one slide

    if ( hideNavigation ) {
      this.element.classList.add('css-slider--no-drag');
      if ( this.o.navigation ) {
        this.prevEl.style.display = 'none';
        this.nextEl.style.display = 'none';
      }
      if ( this.o.thumbnails ) {
        this.thumbnailsEl.style.display = 'none';
      }
    } else {
      this.element.classList.remove('css-slider--no-drag');
      if ( this.o.navigation ) {
        this.prevEl.style.display = 'block';
        this.nextEl.style.display = 'block';
      }
      if ( this.o.thumbnails ) {
        this.thumbnailsEl.style.display = 'block';
      }
    }

    this.checkSlide();

    if ( ! nojump ) {
      this.element.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
    }
    this.element.classList.remove('disable-snapping');

	}

}
customElements.define('css-slider', CSSSlider);

document.addEventListener('shopify:section:load', (e)=>{
  if ( e.target.classList.contains('mount-css-slider') && e.target.querySelector('css-slider') ) {
    e.target.querySelectorAll('css-slider').forEach(slider=>{if(slider.enabled)slider.resetSlider()});
  }
});
class ToggleTab extends HTMLElement {

	constructor(){

		super();

		this.titleEl = this.querySelector('.toggle__title');
		this.contentEl = this.querySelector('.toggle__content');

		this.titleEl.innerHTML = `${this.titleEl.innerHTML}${KROWN.settings.symbols.toggle_pack}`;

		this.titleEl.addEventListener('click',this.onClickHandler.bind(this));
		this.titleEl.addEventListener('keydown', e=>{
			if ( e.keyCode == window.KEYCODES.RETURN ) {
				this.onClickHandler();
			}
		})

	}

	onClickHandler(){
		if ( ! this.titleEl.classList.contains('opened') ) {
			this.titleEl.classList.add('opened');
			this.titleEl.setAttribute('aria-expanded', 'true');
			this.slideDown(this.contentEl, 200);
		} else {
			this.titleEl.classList.remove('opened');
			this.titleEl.setAttribute('aria-expanded', 'false');
			this.slideUp(this.contentEl, 200);
		}
	}

	slideUp(target, duration){
		target.style.transitionProperty = 'height, margin, padding';
	  target.style.transitionDuration = duration + 'ms';
	  target.style.boxSizing = 'border-box';
	  target.style.height = target.offsetHeight + 'px';
	  target.offsetHeight;
	  target.style.overflow = 'hidden';
	  target.style.height = 0;
	  target.style.paddingTop = 0;
	  target.style.paddingBottom = 0;
	  target.style.marginTop = 0;
	  target.style.marginBottom = 0;
	  setTimeout(()=>{
	    target.style.display = 'none';
	    target.style.removeProperty('height');
	    target.style.removeProperty('padding-top');
	    target.style.removeProperty('padding-bottom');
	    target.style.removeProperty('margin-top');
	    target.style.removeProperty('margin-bottom');
	    target.style.removeProperty('overflow');
	    target.style.removeProperty('transition-duration');
	    target.style.removeProperty('transition-property');
	  }, duration);
	}
	slideDown(target, duration) {
		target.style.removeProperty('display');
	  var display = window.getComputedStyle(target).display;

	  if (display === 'none')
	    display = 'block';

	  target.style.display = display;
	  var height = target.offsetHeight;
	  target.style.overflow = 'hidden';
	  target.style.height = 0;
	  target.style.paddingTop = 0;
	  target.style.paddingBottom = 0;
	  target.style.marginTop = 0;
	  target.style.marginBottom = 0;
	  target.offsetHeight;
	  target.style.boxSizing = 'border-box';
	  target.style.transitionProperty = "height, margin, padding";
	  target.style.transitionDuration = duration + 'ms';
	  target.style.height = height + 'px';
	  target.style.removeProperty('padding-top');
	  target.style.removeProperty('padding-bottom');
	  target.style.removeProperty('margin-top');
	  target.style.removeProperty('margin-bottom');
	  setTimeout(()=>{
	    target.style.removeProperty('height');
	    target.style.removeProperty('overflow');
	    target.style.removeProperty('transition-duration');
	    target.style.removeProperty('transition-property');
	  }, duration);
	}

}
customElements.define('toggle-tab', ToggleTab);

document.addEventListener('shopify:block:select', e=>{
	const block = e.target;
	if ( block.classList.contains('toggle') ) {
		if ( !block.querySelector('.toggle__title').classList.contains('opened') ) {
			block.onClickHandler();
		}
	}
})
document.addEventListener('shopify:block:deselect', e=>{
	const block = e.target;
	if ( block.classList.contains('toggle') ) {
		if ( block.querySelector('.toggle__title').classList.contains('opened') ) {
			block.onClickHandler();
		}
	}
})
// isAutoplaySupported (callback)
// test if HTML video autoplay is supported

const isAutoplaySupported = callback => {

  if ( typeof callback !== 'function' ) {
    return false;
  }

  if ( ! sessionStorage.getItem('autoplaySupported' ) ) {
    const canSrc = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA7RtZGF0AAACrAYF//+o3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMTkgYmEyNDg5OSAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTcgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0zIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjguMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAACpliIQAJ//+8dzwKZrlxoFv6nFTjrH/8I5IvpuR7wM+8DluLAAQcGNdwkEAAAAKQZokbEJ/8yAHLAAAAAhBnkJ4jf8JeQAAAAgBnmF0Rf8KSAAAAAgBnmNqRf8KSQAAABBBmmhJqEFomUwIR//kQBXxAAAACUGehkURLG8JeQAAAAgBnqV0Rf8KSQAAAAgBnqdqRf8KSAAAAA9BmqxJqEFsmUwI/4cAU8AAAAAJQZ7KRRUsbwl5AAAACAGe6XRF/wpIAAAACAGe62pF/wpIAAAADkGa70moQWyZTAi/AAJPAAAACUGfDUUVLG8JeQAAAAgBny5qRf8KSQAAA8ptb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAACFwABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAC9HRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAACFwAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAoAAAAFoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAhcAAAMAAAEAAAAAAmxtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACzgAAAYAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAIXbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAB13N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAoABaAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAv/4QAYZ2QAC6zZQo35IQAAAwAMAAADAs4PFCmWAQAGaOviSyLAAAAAGHN0dHMAAAAAAAAAAQAAABAAAAGAAAAAFHN0c3MAAAAAAAAAAQAAAAEAAACIY3R0cwAAAAAAAAAPAAAAAQAAAwAAAAABAAAHgAAAAAEAAAMAAAAAAQAAAAAAAAABAAABgAAAAAEAAAeAAAAAAQAAAwAAAAABAAAAAAAAAAEAAAGAAAAAAQAAB4AAAAABAAADAAAAAAEAAAAAAAAAAQAAAYAAAAABAAAGAAAAAAIAAAGAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAQAAAAAQAAAFRzdHN6AAAAAAAAAAAAAAAQAAAC3gAAAA4AAAAMAAAADAAAAAwAAAAUAAAADQAAAAwAAAAMAAAAEwAAAA0AAAAMAAAADAAAABIAAAANAAAADAAAABRzdGNvAAAAAAAAAAEAAAAwAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ny43Ny4xMDA=';
    let canVideoPlaying = false;
    let canVideo = document.createElement('video');
    canVideo.setAttribute('playsinline', 'playsinline');
    canVideo.setAttribute('muted', 'muted');
    canVideo.setAttribute('autoplay', 'autoplay');
    canVideo.setAttribute('loop', 'loop');
    canVideo.setAttribute('controls', 'controls');
    canVideo.setAttribute('width', 20);
    canVideo.setAttribute('height', 20);
    canVideo.onplay = ()=>{canVideoPlaying = true}
    canVideo.setAttribute('src', canSrc);
    canVideo.style.position = 'fixed';
    canVideo.style.top = '-20px';
    canVideo.style.left = '0px';
    canVideo.style.zIndex = '997';
    document.querySelector('body').appendChild(canVideo);

    let playPromise = canVideo.play();
    if ( playPromise !== undefined ) {
      playPromise.then(()=>{
        callback(true);
        sessionStorage.setItem('autoplaySupported', 'true')
        canVideo.remove();
      })
      .catch((error)=>{
        if ( canVideoPlaying || error.toString().includes('interact with the document') ) {
          callback(true);
          sessionStorage.setItem('autoplaySupported', 'true')
        } else {
          callback(false);
          sessionStorage.setItem('autoplaySupported', 'false');
        }
        canVideo.remove();
      })
    }

  } else {
    if ( sessionStorage.getItem('autoplaySupported') == 'true' ) {
      callback(true);
    } else {
      callback(false);
    }
  }

}

// Video Elements Classes

class VideoPopup extends HTMLElement {

	constructor(){
		super();
		this.querySelector('.video-popup__link').addEventListener('click',e=>{

			e.preventDefault();

			const blackout = document.createElement('div');
			blackout.classList.add('video-popup__blackout');
			this.append(blackout);
			setTimeout(()=>{
				blackout.style.opacity = '1';
			},10)

      this.classList.add('video-opened');

      if ( this.querySelector('.video-popup__close') ) {
        this.querySelector('.video-popup__close').addEventListener('click', e=>{
          this.querySelectorAll('iframe, video').forEach(elm=>{elm.remove()});
          blackout.remove();
          this.classList.remove('video-opened');
        })
      }

			setTimeout(()=>{
        pauseAllMedia();
        this.querySelector('.video-popup__container').appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
        setTimeout(()=>{
          playMedia(this.closest('[data-video]'));
        }, 500);
			},50);

		});

	}

}

customElements.define('video-popup', VideoPopup);

class VideoBackground extends HTMLElement {

  constructor(){

    super();
    isAutoplaySupported(canAutoPlay=>{
      if ( canAutoPlay ) {
        const video = this.querySelector('.video-text__background');
        if ( video ) {
          video.innerHTML = `<video autoplay muted loop playsinline><source type="video/mp4" src="${video.dataset.src}"></video>`;
          video.querySelector('video').play();
          setTimeout(()=>{
            video.querySelector('video').style.opacity = '1';
          }, 200);
        }
      } else {
        this.querySelector('.video-text__background .video-text__image').style.display = 'block';
      }
    })
    
  }

}

customElements.define('video-background', VideoBackground);
KROWN.helpers = {

  formatMoney: function(cents, format){

    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }

    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);

  }

}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Returns pseudo content

const getPseudoContent = selector => {
	var element = document.querySelector(selector),
			pseudo = window.getComputedStyle(element, ':after');
	return pseudo.getPropertyValue('content');
}

const pauseAllMedia = () => {
  document.querySelectorAll('.product .js-youtube').forEach(video => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.product .js-vimeo').forEach(video => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('.product video').forEach(video => video.pause());
  document.querySelectorAll('.product product-model').forEach(model => {
    if ( model.modelViewerUI ) 
      model.modelViewerUI.pause()
  });
}

const playMedia = (media) => {
  switch ( media.dataset.productMediaType ) {
    case 'video':
      media.querySelector('video').play();
      break;
    case 'external_video-youtube':
      media.querySelector('.js-youtube').contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
      break;
    case 'external_video-vimeo':
      media.querySelector('.js-vimeo').contentWindow.postMessage('{"method":"play"}', '*');
      break;
  }
}

/*!
 * Serialize all form data into a SearchParams string
 * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */

const serializeForm = form => {
  let arr = [];
  Array.prototype.slice.call(form.elements).forEach(function(field) {
    if (
      !field.name ||
      field.disabled ||
      ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
    )
      return;
    if (field.type === 'select-multiple') {
      Array.prototype.slice.call(field.options).forEach(function(option) {
        if (!option.selected) return;
        arr.push(
          encodeURIComponent(field.name) +
            '=' +
            encodeURIComponent(option.value)
        );
      });
      return;
    }
    if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
      return;
    arr.push(
      encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
    );
  });
  return arr.join('&');
};

// get jsonp

const getJSONP = (url, success) => {

  var ud = '_' + +new Date,
      script = document.createElement('script'),
      head = document.getElementsByTagName('head')[0] 
             || document.documentElement;

  window[ud] = function(data) {
      head.removeChild(script);
      success && success(data);
  };

  script.src = url.replace('callback=?', 'callback=' + ud);
  head.appendChild(script);

}

const trueTypeOf = obj => {
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
}

const htmlEscape = input => {
  return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

const reframe = (target, cName) => {
  let frames = (typeof target === 'string') ? document.querySelectorAll(target) : target
  const c = cName || 'js-reframe'
  if (!('length' in frames)) frames = [frames]
  for (let i = 0; i < frames.length; i += 1) {
    const frame = frames[i]
    // makes sure reframe is not run more than 1x ✔️
    const hasClass = frame.className.split(' ').indexOf(c) !== -1

    if (hasClass || frame.style.width.indexOf('%') > -1) continue

    // get height width attributes
    const h = frame.getAttribute('height') || frame.offsetHeight
    const w = frame.getAttribute('width') || frame.offsetWidth

    // general targeted <element> sizes
    const padding = (h / w) * 100

    // created element <wrapper> of general reframed item
    // => set necessary styles of created element <wrapper>
    const div = document.createElement('div')
    div.className = c
    const divStyles = div.style
    divStyles.position = 'relative'
    divStyles.width = '100%'
    divStyles.paddingTop = `${padding}%`

    // set necessary styles of targeted <element>
    const frameStyle = frame.style
    frameStyle.position = 'absolute'
    frameStyle.width = '100%'
    frameStyle.height = '100%'
    frameStyle.left = '0'
    frameStyle.top = '0'

    // reframe targeted <element>
    frame.parentNode.insertBefore(div, frame)
    frame.parentNode.removeChild(frame)
    div.appendChild(frame)
  }
}

window.KEYCODES = {
  TAB: 9,
  ESC: 27,
  DOWN: 40,
  RIGHT: 39,
  UP: 38,
  LEFT: 37,
  RETURN: 13
};
/* 
	* This is the class for the theme's
		unique (main) sidebar navigation
*/

class MainSidebar extends HTMLElement {

	constructor(){

		super();

		// scroll & resize for sticky sidebar assistance

		this.SCROLL_EVENT = (e=>{
			if ( this.offsetHeight > window.innerHeight ) {
				this.style.transform = 'translate3d(0,' + ( window.scrollY * -1 ) + 'px, 0)';
			} else {
				this.style.transform = 'translate3d(0,' + ( ( this.offsetHeight - window.innerHeight ) * -1 ) + 'px, 0)';
			}
		})
		this.addEventListener('scroll', this.SCROLL_EVENT, {passive:true});

		this.RESIZE_EVENT = debounce(()=>{
			if ( this.offsetHeight > window.innerHeight ) {
				this.SCROLL_EVENT();
			} else {
				this.style.transform = 'translate3d(0, 0, 0)';
			}
			this.setSidebarHeight();
		}, 300);
		this.addEventListener('resize', this.RESIZE_EVENT, {passive:true});
		setTimeout(()=>{
			this.RESIZE_EVENT();
		}, 310);

		// cart setup

	 	if ( ! document.body.classList.contains('template-cart') && KROWN.settings.cart_action == 'overlay' ) {

	 		const sidebarCart = document.querySelector('.sidebar__cart');
	 		if ( document.querySelector('.sidebar__cart-handle') ) {
		 		document.querySelector('.sidebar__cart-handle').addEventListener('click', e=>{
		 			e.preventDefault();
					sidebarCart.show();
		 		});
		 	}

		 	if ( document.querySelector('.sidebar__cart-handle') ) {
			 	document.querySelector('.sidebar__cart-handle').addEventListener('keyup', e=>{
					if ( e.keyCode == window.KEYCODES.RETURN ) {
						setTimeout(()=>{
							document.querySelector('.sidebar__cart .sidebar__cart-close').focus();
						}, 100);
					}
			 	});
			 }

		}

		// search setup 

		const sidebarSearch = document.querySelector('.sidebar__search');

		if ( KROWN.settings.predictive_search_enabled == "false" ) {

			if ( document.querySelector('.sidebar__search-handle') ) {
				document.querySelector('.sidebar__search-handle').addEventListener('click', e=>{

					e.preventDefault();

			 		if ( ! sidebarSearch.classList.contains('opened') ) {
			 			sidebarSearch.classList.add('opened');
			 			document.querySelector('.sidebar__search input[type="search"]').setAttribute('placeholder', document.querySelector('.sidebar__search input[type="search"]').dataset.responsivePlaceholder);
			 			setTimeout(()=>{
			 				document.querySelector('.sidebar__search input[type="search"]').focus();
			 			}, 100);
			 		} else {
			 			sidebarSearch.classList.remove('opened');
			 		}

				});
			}

		} else {

			this.closePredictiveSearch = (()=>{
				document.querySelector('.sidebar').classList.remove('no-transforms');
				sidebarSearch.classList.remove('open-search');
				sidebarSearch.classList.remove('opened');
				this.querySelector('[data-search-results]').classList.remove('show');
				this.querySelector('[data-search-link]').classList.remove('show');
 				document.body.classList.remove('overflow-hidden');
				document.querySelector('.cart-overlay-background').classList.remove('show');
				document.querySelector('.cart-overlay-background').removeEventListener('click', this.closePredictiveSearch);
			}).bind(this);

			if ( document.querySelector('.sidebar__search-handle') ) {
				document.querySelector('.sidebar__search-handle').addEventListener('click', e=>{
	        const afterContent = window.getComputedStyle(sidebarSearch,':after').content;
					if ( afterContent.includes('predictive-mobile') ) {
						e.preventDefault();
				 		if ( ! sidebarSearch.classList.contains('opened') ) {
				 			sidebarSearch.show();
				 		} else {
				 			sidebarSearch.hide();
				 		}
				 	}
				});
			}

			if ( this.querySelector('input[type="search"]') ) {
			 	this.querySelector('input[type="search"]').addEventListener('click', e=>{
			 		if ( ! sidebarSearch.classList.contains('open-search') ) {
						this.setSidebarHeight()
						document.querySelector('.sidebar').classList.add('no-transforms');
						sidebarSearch.classList.add('open-search');
						sidebarSearch.classList.add('opened');
						this.querySelector('[data-search-results]').classList.add('show');
						//this.querySelector('[data-search-link]').classList.add('show');
		 				document.body.classList.add('overflow-hidden');
						document.querySelector('.cart-overlay-background').classList.add('show');
						document.querySelector('.cart-overlay-background').addEventListener('click', this.closePredictiveSearch);
			 		}
			 	});
			}

			if ( this.querySelector('.sidebar__search-close') ) {
			 	this.querySelector('.sidebar__search-close').addEventListener('click', e=>{
	        const afterContent = window.getComputedStyle(sidebarSearch,':after').content;
			 		if ( ! afterContent.includes('predictive-mobile') ) {
			 			this.closePredictiveSearch();
			 		}
			 	});
			}

			document.addEventListener('keydown', e=>{
				if ( e.keyCode == window.KEYCODES.ESC ) {  
					const afterContent = window.getComputedStyle(sidebarSearch,':after').content;
			 		if ( sidebarSearch.classList.contains('open-search') && ! afterContent.includes('predictive-mobile') ) {
			 			this.closePredictiveSearch();
			 		}
				}
			});

		}

		// mobile menu setup

		const sidebarMenus = document.querySelector('.sidebar__menus');
		if ( document.querySelector('.sidebar__menu-handle') ) {
			document.querySelector('.sidebar__menu-handle').addEventListener('click', e=>{
				e.preventDefault();
				sidebarMenus.classList.remove('kill-overflow');
				if ( ! sidebarMenus.classList.contains('opened') ) {
					sidebarMenus.show();
				} else {
					sidebarMenus.hide();
				}
			});
		}

		let submenuLevel = 0;

		document.querySelectorAll('.sidebar__menus .sidebar__menu .has-submenu > a').forEach(elm=>{
			elm.addEventListener('click', e=>{
				if ( window.innerWidth <= 948 ) {
					e.preventDefault();
					e.stopPropagation();
					sidebarMenus.classList.add('kill-overflow');
			 		sidebarMenus.scrollTop = 0;
			 		if ( elm.parentNode.classList.contains('has-second-submenu') ) {
			 			submenuLevel = 2;
			 		} else {
			 			submenuLevel = 1;
			 		}
			 		elm.parentNode.classList.add('open-submenu');
			 		elm.parentNode.parentNode.classList.add('opened-submenu');
			 		elm.closest('.sidebar__menus').classList.add('opened-submenus');
			 		if ( elm.parentNode.parentNode.parentNode.classList.contains('primary-menu') ) {
			 			elm.parentNode.parentNode.parentNode.nextElementSibling.classList.add('opened-other-submenu');
			 		} else {
			 			elm.parentNode.parentNode.parentNode.previousElementSibling.classList.add('opened-other-submenu');
			 		}
				}
			});
		})

		document.querySelector('.sidebar__menus-back').addEventListener('click', e=>{
			if ( submenuLevel == 1 ) {
				submenuLevel = 0;
	 			sidebarMenus.classList.remove('opened-submenus');
	 			sidebarMenus.querySelector('nav.opened-other-submenu').classList.remove('opened-other-submenu');
	 			sidebarMenus.querySelector('.opened-submenu').classList.remove('opened-submenu');
	 			sidebarMenus.querySelector('.open-submenu').classList.remove('open-submenu');
				sidebarMenus.classList.remove('kill-overflow');
			} else if ( submenuLevel == 2 ) {
				submenuLevel = 1;
	 			document.querySelector('.has-second-submenu.open-submenu').parentNode.classList.remove('opened-submenu');
	 			document.querySelector('.has-second-submenu.open-submenu').classList.remove('open-submenu');
			}
		})

		// desktop menu initialization - pretty complex stuff

	 	this.sidebarParentFLAG = false,
		this.sidebarSeconds = document.querySelector('.sidebar__seconds'),
		this.sidebarSecondsDOM = document.querySelector('.sidebar__seconds .sidebar__menu'),
		this.sidebarSecondsFLAG = false,
		this.sidebarThirds = document.querySelector('.sidebar__thirds'),
		this.sidebarThirdsDOM = document.querySelector('.sidebar__thirds .sidebar__menu'),
		this.sidebarThirdsFLAG = false;

	 	document.querySelectorAll('.has-first-submenu > a').forEach(elm=>{
	 		elm.addEventListener('touchstart', e=>{
	 			if ( window.innerWidth > 948 ) {
	 				e.preventDefault();	 				
	 				elm.parentNode.querySelectorAll('a')[0].style.pointerEvents = 'none'; 
	 				this.onMouseEnterHandlerFirst({currentTarget:elm.parentNode,preventDefault:()=>{}});
	 			}
	 		}, {passive: true});
	 	});

	 	document.querySelectorAll('.has-first-submenu').forEach(elm=>{
	 		elm.addEventListener('mouseenter', this.onMouseEnterHandlerFirst.bind(this));
	 		elm.addEventListener('mouseleave', this.onMouseLeaveHandlerFirst.bind(this));
	 	});

	 	this.sidebarSeconds.addEventListener('mouseenter', ()=>{
	 		document.body.classList.add('show-overlay');
	 		this.sidebarSeconds.classList.add('opened');
	 		if ( this.sidebarSeconds.querySelector('.sidebar__submenu--first') ) {
	 			this.sidebarSeconds.querySelector('.sidebar__submenu--first').classList.add('submenu-opened');
	 		}
	 	})
	 	this.sidebarSeconds.addEventListener('mouseleave', this.onMouseLeaveHandlerFirst.bind(this));

	 	this.sidebarThirds.addEventListener('mouseenter', ()=>{
	 		document.body.classList.add('show-overlay');
	 		this.sidebarThirds.classList.add('opened');
	 		this.sidebarSeconds.classList.add('opened');
	 		this.sidebarSeconds.querySelector('.sidebar__submenu--first').classList.add('submenu-opened');
	 		this.sidebarThirds.querySelector('.sidebar__submenu--second').classList.add('submenu-opened');
	 	});
	 	this.sidebarThirds.addEventListener('mouseleave', ()=>{
	 		this.onMouseLeaveHandlerFirst();
	 		this.onMouseLeaveHandlerSecond();
	 	});

	 	// a11y setup

		let activeElement = document.activeElement;
		let activeMenu_l1 = null;
		let activeMenu_l2 = null;
		let activeMenu_lFlag = false;
	  document.addEventListener('keyup', e=>{

	    if ( e.keyCode == window.KEYCODES.TAB ) {

	    	if ( document.activeElement.classList.contains('parent-has-submenu') ) {

	    		if ( document.activeElement.parentNode.classList.contains('has-first-submenu') ) {
		    		// first level of submenus - open secondary sidebar
		 				this.onMouseEnterHandlerFirst({currentTarget:document.activeElement.parentNode,preventDefault:()=>{}});
	    		} else if ( document.activeElement.parentNode.classList.contains('has-second-submenu') ) {
	    			// second level of submenus
		 				this.onMouseEnterHandlerSecond({currentTarget:document.activeElement.parentNode,preventDefault:()=>{}});
	    		}

	    		// second level of submenus - open third sidebar
	    		if ( document.activeElement.classList.contains('sub-menu__link-second') ) {
	    			if ( ! document.activeElement.classList.contains('sub-menu__last-second') ) {
	    				activeMenu_l2 = document.activeElement.parentNode.nextElementSibling.querySelector(':scope > a');
	    			} else {
	    				activeMenu_l2 = activeMenu_l1;
	    				activeMenu_lFlag = true;
	    			}
	    		} else {
	    			if ( document.activeElement.parentNode.nextElementSibling ) {
	    				activeMenu_l1 = document.activeElement.parentNode.nextElementSibling.querySelector(':scope > a');
	    			} else {
	    				if ( document.activeElement.dataset.type == 'primary' ) {
	    					activeMenu_l1 = document.querySelector('.secondary-menu').querySelectorAll('a')[0];
	    				} else if ( document.activeElement.dataset.type == 'secondary' ) {
	    					if ( document.querySelector('.accounts-menu')) {
	    						activeMenu_l1 = document.querySelector('.accounts-menu').querySelectorAll('a')[0];
	    					} else if ( document.querySelector('.sidebar .localization-form__item') ) {
	    						activeMenu_l1 = document.querySelectorAll('.sidebar .localization-form__item')[0].querySelectorAll('button')[0];
	    					} else {
	    						activeMenu_l1 = document.querySelector('.sidebar .sidebar__search form');
	    					}
	    				}
	    			}
	    		}

	    	} else if ( activeElement.classList.contains('sub-menu__last-second') ) {

	    		// second submenu items
    			if ( ! activeElement.classList.contains('parent-has-submenu') || activeElement.classList.contains('ran-over') ) {
    				if ( activeMenu_l1 ) {
	    				activeMenu_l1.focus();
    				}
				 		this.onMouseLeaveHandlerFirst();
    			} else {
    				activeElement.classList.add('ran-over');
    			}

	    	} else if ( activeElement.classList.contains('sub-menu__last-third') ) {

    				if ( activeMenu_l2 ) {
		    			activeMenu_l2.focus();
		    		}

	 					this.onMouseLeaveHandlerSecond();

	 					if ( document.activeElement.classList.contains('sub-menu__last-second') && document.activeElement.classList.contains('ran-over') ) {
			 				this.onMouseLeaveHandlerFirst();
			 				this.onMouseLeaveHandlerSecond();
	    				if ( activeMenu_l1 ) {
			    			activeMenu_l1.focus();
			    		}
			    	} else if ( document.activeElement.parentNode.classList.contains('has-second-submenu') ) {
		 					this.onMouseEnterHandlerSecond({currentTarget:document.activeElement.parentNode,preventDefault:()=>{}});
		 					if ( ! document.activeElement.classList.contains('sub-menu__last-second') ) {
		    				activeMenu_l2 = document.activeElement.parentNode.nextElementSibling.querySelector(':scope > a');
		    			} 
			    	} 

				 		if ( activeMenu_lFlag ) {
				 			activeMenu_lFlag = false;
					 		this.onMouseLeaveHandlerFirst();
				 		}

	    	}

	      activeElement = document.activeElement;

	    }
	  });

	  document.addEventListener('keydown', e=>{
	    if ( e.keyCode == window.KEYCODES.TAB ) {
	    	if ( activeElement.classList.contains('parent-has-submenu') ) {
	    		e.preventDefault();
	    		// focus on second level
	    		this.sidebarSeconds.querySelectorAll('a')[0].focus();
	    		// focus on third level
	    		if ( activeElement.classList.contains('sub-menu__link-second') ) {
	    			this.sidebarThirds.querySelectorAll('a')[0].focus();
	    		}
	  		} 
	  	} else if ( e.keyCode == window.KEYCODES.ESC ) {
	  		if ( this.sidebarSecondsFLAG ) {
			 		this.onMouseLeaveHandlerFirst();
	  		}
	  		if ( this.sidebarThirdsFLAG ) {
 					this.onMouseLeaveHandlerSecond();
	  		}
	  	}
	  });

	}

	onMouseEnterHandlerFirst(e){

		if ( window.innerWidth > 948 ) {

	 		e.preventDefault();

	 		document.body.classList.add('show-overlay');
	 		this.sidebarSeconds.classList.add('opened');
		 	this.sidebarSecondsFLAG = true;

	 		let openedSubmenu = document.createElement('div');
	 		openedSubmenu.classList.add('clone');
	 		openedSubmenu.innerHTML = e.currentTarget.querySelector(':scope > .sidebar__submenu').outerHTML;
	 		openedSubmenu = openedSubmenu.querySelector(':scope > div');

		 	if ( ! this.sidebarSecondsDOM.querySelector('.sidebar__submenu') || ( this.sidebarSecondsDOM.querySelector('.sidebar__submenu').dataset.handle != openedSubmenu.dataset.handle ) ) {
 				this.sidebarSecondsDOM.innerHTML = openedSubmenu.outerHTML;
		 	}

	 		this.sidebarSecondsDOM.querySelector(':scope > .sidebar__submenu .sub-menu').style.paddingTop = e.currentTarget.getBoundingClientRect().top + 'px';
	 		setTimeout(()=>{
	 			this.sidebarSecondsDOM.querySelector(':scope > .sidebar__submenu').classList.add('submenu-opened');
	 		}, 10);	

		 	this.sidebarSecondsDOM.querySelectorAll('.has-second-submenu').forEach(elm=>{

		 		elm.addEventListener('touchstart', e=>{
		 			e.preventDefault();
	 				elm.parentNode.querySelectorAll('a')[0].style.pointerEvents = 'none'; 
		 			this.onMouseEnterHandlerSecond({currentTarget:elm,preventDefault:()=>{}});
	 				if ( this.sidebarThirdsFLAG ) {
	 					this.onMouseLeaveHandlerSecond();
	 				}
	 			}, {passive: true});

		 		elm.addEventListener('mouseenter', this.onMouseEnterHandlerSecond.bind(this));
		 		elm.addEventListener('mouseleave', ()=>{
	 				if ( this.sidebarThirdsFLAG ) {
	 					this.onMouseLeaveHandlerSecond();
					}
		 		})

		 	});

	 		e.currentTarget.addEventListener('mouseleave', this.onMouseLeaveHandlerSecond.bind(this));

	 	}

	}

	onMouseEnterHandlerSecond(e){

		e.preventDefault();

 		this.sidebarThirds.classList.add('opened');
 		this.sidebarThirdsFLAG = true;

 		let openedSubmenu = document.createElement('div');
 		openedSubmenu.classList.add('clone');
 		openedSubmenu.innerHTML = e.currentTarget.querySelector(':scope > .sidebar__submenu').outerHTML;
 		openedSubmenu = openedSubmenu.querySelector(':scope > div');

 		if ( !this.sidebarThirdsDOM.querySelector('.sidebar__submenu') || ( this.sidebarThirdsDOM.querySelector('.sidebar__submenu') && this.sidebarThirdsDOM.querySelector('.sidebar__submenu').dataset.handle != openedSubmenu.dataset.handle ) ) {
 			this.sidebarThirdsDOM.innerHTML = openedSubmenu.outerHTML;
 		}

		this.sidebarThirdsDOM.querySelector(':scope > .sidebar__submenu .sub-menu').style.paddingTop = e.currentTarget.getBoundingClientRect().top + 'px';
 		setTimeout(()=>{
 			this.sidebarThirdsDOM.querySelector(':scope > .sidebar__submenu').classList.add('submenu-opened');
 		}, 10);	

	}

	onMouseLeaveHandlerFirst(){
 		this.sidebarSeconds.classList.remove('opened');
 		if ( this.sidebarSeconds.querySelector('.submenu-opened') ) {
	 		this.sidebarSeconds.querySelector('.submenu-opened').classList.remove('submenu-opened');
	 	}
 		document.body.classList.remove('show-overlay');
 		this.sidebarSecondsFLAG = false;
	}

	onMouseLeaveHandlerSecond(){
 		this.sidebarThirds.classList.remove('opened');
 		if ( this.sidebarThirds.querySelector('.submenu-opened') ) {
	 		this.sidebarThirds.querySelector('.submenu-opened').classList.remove('submenu-opened');
	 	}
 		this.sidebarThirdsFLAG = false;
	}

	setSidebarHeight(){
		document.querySelectorAll('.sidebar__cart, .sidebar__cart .cart, .sidebar__search, .collection__filters, .collection__filters .filters').forEach(elm=>{elm.style.height=window.innerHeight+'px'});
		document.querySelector('.sidebar__menus').style.height = window.innerHeight+'px';
		if ( document.querySelector('.sidebar__search.predictive-search .sidebar__search-results') ) {
			document.querySelector('.sidebar__search.predictive-search .sidebar__search-results').style.maxHeight = (window.innerHeight-170)+'px';
		}
	}

}

customElements.define('main-sidebar', MainSidebar);

// static events for modal overlays

let overlay = document.createElement('span');
overlay.className = 'cart-overlay-background';
overlay.addEventListener('click', ()=>{
	document.querySelector('sidebar-drawer.opened').hide();
});
document.body.append(overlay);

overlay = document.createElement('span');
overlay.className = 'sidebar-overlay-background';
overlay.addEventListener('click', ()=>{
	document.querySelector('sidebar-drawer.opened').hide();
});
document.body.append(overlay);

/* 
	* This is the class for modal sidebars
*/

class SidebarDrawer extends HTMLElement {

	constructor(){
		super();
		this.querySelector('[data-close]').addEventListener('click', ()=>{
			this.hide();
		});
		document.addEventListener('keydown', e=>{
			if ( e.keyCode == window.KEYCODES.ESC ) {
				const openedSidebar = document.querySelector('sidebar-drawer.opened');
				if ( openedSidebar ){
					openedSidebar.hide();
				}
			}
		});
		this.setAttribute('style', '');
	}

	/* 
		* generic hide/show functions 
	*/

	show(){

		this.opened = true;
		this.classList.add('opened');
		document.body.classList.add('overflow-hidden');

		if ( this.dataset.overlay == 'sidebar' ) {
			document.querySelector('.sidebar-overlay-background').classList.add('show');
		} else if ( this.dataset.overlay == 'cart' ) {
			document.querySelector('.cart-overlay-background').classList.add('show');
		}

		document.querySelectorAll('.sidebar__cart, .sidebar__cart .cart, .sidebar__search, .collection__filters, .collection__filters .filters').forEach(elm=>{elm.style.height=window.innerHeight+'px'});
		document.querySelector('.sidebar__menus').style.height = window.innerHeight+'px';
		if ( document.querySelector('.sidebar__search.predictive-search .sidebar__search-results') ) {
			document.querySelector('.sidebar__search.predictive-search .sidebar__search-results').style.maxHeight = (window.innerHeight-170)+'px';
		}

		this._mountA11YHelper();

	}

	hide(){

		this.opened = false;
		this.classList.remove('opened');
		document.body.classList.remove('overflow-hidden');

		if ( this.dataset.overlay == 'sidebar' ) {
			document.querySelector('.sidebar-overlay-background').classList.remove('show');
		} else if ( this.dataset.overlay == 'cart' ) {
			document.querySelector('.cart-overlay-background').classList.remove('show');
		}

		this._unmountA11YHelper();

	}


	/*
		* a11y helpers / tab catcher 
	*/

	_mountA11YHelper(forcedFocus){

		let focusable = forcedFocus ? forcedFocus : this.querySelectorAll('[tabindex="0"], button, [href], input:not([type="hidden"]), select, textarea, .regular-select-cover');

		let firstFocusable = focusable[0];
		let lastFocusable = focusable[focusable.length - 1];

		if ( this.classList.contains('sidebar__cart') && ! this.querySelector('.cart__form').classList.contains('cart--empty') ) {
			lastFocusable = focusable[focusable.length - 2];
		}

		this.A11Y_TAB_EVENT = ((firstFocusable, lastFocusable, e)=>{
		  let isTabPressed = (e.key === 'Tab' || e.keyCode === window.KEYCODES.TAB);
		  if (!isTabPressed) { 
		    return; 
		  }
		  if ( e.shiftKey ) /* shift + tab */ {
		    if (document.activeElement === firstFocusable) {
	     		lastFocusable.focus();
	        e.preventDefault();
	      }
	    } else /* tab */ {
		    if (document.activeElement === lastFocusable) {
	      	firstFocusable.focus();
	        e.preventDefault();
	      }
	    }
		}).bind(this, firstFocusable, lastFocusable)

 		this.addEventListener('keydown', this.A11Y_TAB_EVENT);

	}

	_unmountA11YHelper(sidebar){
		this.removeEventListener('keydown', this.A11Y_TAB_EVENT);
	}

}

customElements.define('sidebar-drawer', SidebarDrawer);

class ProductModel extends HTMLElement {
  constructor() {
    super();  
    Shopify.loadFeatures([
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this.setupModelViewerUI.bind(this),
      },
    ]);
  }
  setupModelViewerUI(errors) {
    if (errors) return;
    this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));
    const modelViewerEl = this.modelViewerUI.viewer;
    modelViewerEl.addEventListener('shopify_model_viewer_ui_toggle_play', ()=>{
      if ( modelViewerEl.closest('.css-slider-holder') ) {
        modelViewerEl.closest('.css-slider-holder').classList.add('css-slider--disable-dragging');
      }        
    });
    modelViewerEl.addEventListener('shopify_model_viewer_ui_toggle_pause', ()=>{
      if ( modelViewerEl.closest('.css-slider-holder') ) {
        modelViewerEl.closest('.css-slider-holder').classList.remove('css-slider--disable-dragging');
      }        
    });
    if ( modelViewerEl.closest('.product-gallery__item') && modelViewerEl.closest('.product-gallery__item').dataset.index == '0' ) {
      if ( modelViewerEl.closest('.css-slider-holder') ) {
        modelViewerEl.closest('.css-slider-holder').classList.add('css-slider--disable-dragging');
      }  
    }
  }
}
customElements.define('product-model', ProductModel);

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  setupShopifyXR(errors) {
    
    if (errors) return;
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      );
      return;
    }
    document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
      modelJSON.remove();
    });
    window.ShopifyXR.setupXRElements();
  }
};
class ProductQuantity extends HTMLElement {

	constructor(){

		super();

		const qty = this.querySelector('.quantity__selector'),
					qtyMinus = this.querySelector('.quantity__minus'),
					qtyPlus = this.querySelector('.quantity__plus'),
					qtyMin = qty.getAttribute('min') ? parseInt(qty.getAttribute('min')) : 1,
					qtyMax = qty.getAttribute('max') ? parseInt(qty.getAttribute('max')) : 999;

		if ( parseInt(qty.value) - 1 < qtyMin ) {
			qtyMinus.classList.add('disabled');
		}
		if ( parseInt(qty.value) + 1 > qtyMax ) {
			qtyPlus.classList.add('disabled');
		}

		qtyMinus.addEventListener('click', (e)=>{
			e.preventDefault();
			if ( ! qtyMinus.classList.contains('disabled') ) {
				const currentQty = parseInt(qty.value);
				if ( currentQty - 1 >= qtyMin ) {
					qty.value = currentQty - 1;
					qtyPlus.classList.remove('disabled');
				} 
				if ( currentQty - 1 <= qtyMin ) {
					qtyMinus.classList.add('disabled');
				}
			}
		});

		qtyPlus.addEventListener('click', (e)=>{
			e.preventDefault();
			if ( ! qtyPlus.classList.contains('disabled') ) {
				const currentQty = parseInt(qty.value);
				if ( currentQty + 1 <= qtyMax ) {
					qty.value = currentQty + 1;
					qtyMinus.classList.remove('disabled');
				} 
				if ( currentQty + 1 >= qtyMax ) {
					qtyPlus.classList.add('disabled');
				}
			}
		});

	}
	
}

customElements.define('product-quantity', ProductQuantity);
class SharePopup extends HTMLElement {

	constructor(){
		super();
		basicLightbox.create(this.querySelector('#share-popup'), {
			trigger: this.querySelector('.share-link'),
			focus: 'a'
		});
	}

}
customElements.define('share-popup', SharePopup)
class CollectionFiltersMobileHandle extends HTMLElement {
  constructor(){
    super();
    this.querySelector('button').addEventListener('click', ()=>{
      document.querySelector('.collection__filters').show();
    })
  }
}
customElements.define('collection-filters-mobile-handle', CollectionFiltersMobileHandle);
class ProductDescription extends HTMLElement {

	constructor(){
		super();
		this.init();
	}

	init(){

		this.description = this.querySelector('.product__description');

		if ( this.description.classList.contains('truncated') ) {

			this.descriptionInner = this.description.querySelector('.product__description-inner');

			if ( this.descriptionInner.offsetHeight - 10 > this.description.offsetHeight ) {

				this.descriptionTrigger = document.createElement('a');
				this.descriptionTrigger.classList.add('truncated__trigger');
				this.descriptionTrigger.setAttribute('tabindex', '0');
				this.descriptionTrigger.setAttribute('aria-controls', this.descriptionInner.id);
				this.descriptionTrigger.setAttribute('aria-expanded', false);
				this.descriptionTrigger.textContent = KROWN.settings.locales.product_more_description_label;
				this.description.after(this.descriptionTrigger);

				this.descriptionTrigger.addEventListener('click', this.onClickHandler.bind(this));
				this.descriptionTrigger.addEventListener('keydown', (e) => {
					if ( e.keyCode == window.KEYCODES.RETURN ) {
						this.onClickHandler(e);
					}
				})

			}
			
		}

	}

	onClickHandler(e) {
		e.preventDefault();
		if ( ! this.description.classList.contains('truncated--show') ) {
			this.description.classList.add('truncated--show');
			this.description.style.maxHeight = this.descriptionInner.offsetHeight + 'px';
			this.descriptionTrigger.textContent = KROWN.settings.locales.product_less_description_label;
			this.descriptionTrigger.setAttribute('aria-expanded', true);
			this.descriptionInner.setAttribute('tabIndex', '0');
		} else {
			this.description.classList.remove('truncated--show');
			this.description.setAttribute('style', '');
			this.descriptionTrigger.textContent = KROWN.settings.locales.product_more_description_label;
			this.descriptionTrigger.setAttribute('aria-expanded', false);
		}
	}

}

customElements.define('product-description', ProductDescription);

document.addEventListener('shopify:section:load', e=>{
	if ( e.target.classList.contains('main-product') ) {
		if ( e.target.querySelector('product-description') ) {
			e.target.querySelector('product-description').init();
		}
	}
});

/* ---
	Product Page
--- */

class ProductPage extends HTMLElement {

	constructor(){

		super();

		this.productGallery = this.querySelector('.product-gallery');
		this.productSlider = this.querySelector('css-slider');

		// Gallery thumbnails

		if ( this.querySelector('.product-gallery__thumbnails .thumbnail') ) {

			this.querySelectorAll('.product-gallery__thumbnails .thumbnail').forEach((elm, i)=>{
				if ( i == 0 )
					elm.classList.add('active');
				elm.addEventListener('click',e=>{
					if ( this.productSlider.sliderEnabled ) {
						this.productSlider.changeSlide(e.currentTarget.dataset.index);
					} else {
						window.scrollTo({
	          	top: this.productGallery.querySelector(`.product-gallery__item[data-index="${e.currentTarget.dataset.index}"]`).offsetTop + this.offsetTop,
	            behavior: 'smooth'
	          });
						this.thumbnailNavigationHelper(e.currentTarget.dataset.index);
					}
					pauseAllMedia();
					playMedia(this.productGallery.querySelector(`.product-gallery__item[data-index="${e.currentTarget.dataset.index}"]`));
				});
			})

			this.productSlider.addEventListener('change', e=>{
				this.thumbnailNavigationHelper(e.target.index);
			});

		}

		this.productSlider.addEventListener('navigation', e=>{
			playMedia(this.productGallery.querySelector(`.product-gallery__item[data-index="${e.target.index}"]`));
		})
		this.productSlider.addEventListener('change', e=>{
			if ( this.productGallery.querySelector(`.product-gallery__item[data-index="${e.target.index}"]`).dataset.productMediaType == 'model' && this.xrButton ) {
				this.xrButton.setAttribute('data-shopify-model3d-id', this.productGallery.querySelector(`.product-gallery__item[data-index="${e.target.index}"]`).dataset.mediaId);
			}
			pauseAllMedia();
			this.thumbnailNavigationHelper(e.target.index);
		});

		// Product variant event listener for theme specific logic

		const productVariants = this.querySelector('product-variants');
		if ( productVariants ) {
			productVariants.addEventListener('VARIANT_CHANGE', this.onVariantChangeHandler.bind(this));
			this.onVariantChangeHandler({target:productVariants});
		}

		// show cart drawer when element is added to cart

	 	if ( ! document.body.classList.contains('template-cart') && KROWN.settings.cart_action == 'overlay' ) {

			let addToCartEnter = false;
			if ( this.querySelector('.product__add-to-cart') ) {
		 		this.querySelector('.product__add-to-cart').addEventListener('keyup', e=>{
					if ( e.keyCode == window.KEYCODES.RETURN ) {
						addToCartEnter = true;
					}
		 		})
		 	}

		 	if ( this.querySelector('.product__form') ) {
		 		this.querySelector('.product__form').addEventListener('add-to-cart', ()=>{
	    		window.preloadImages(document.querySelector('.sidebar__cart'));
		 			document.querySelector('.sidebar__cart').show();
		 			if ( addToCartEnter ) {
						setTimeout(()=>{
							document.querySelector('.sidebar__cart .sidebar__cart-close').focus();
						}, 200);
		 			}
		 		});
		 	}

	 	}

		// Gallery resize helper

		this.GALLERY_RESIZE_EVENT = debounce(()=>{
			ProductGalleryResizeHelper(this.productGallery);
		}, 100);
		window.addEventListener('resize', this.GALLERY_RESIZE_EVENT, {passive:true});

		// Scroll navigation helper 

		if ( this.productGallery.classList.contains('product-gallery--scroll') ) {

			this.productGalleryNavigation = this.querySelector('.product-gallery__thumbnails');
			this.productGalleryNavigationItem = this.querySelectorAll('.product-gallery__thumbnails .thumbnail');

			const productGallerySlides = this.productGallery.querySelectorAll('.product-gallery__item');
			const reversedGallerySlides = [...productGallerySlides].reverse();

			this.GALLERY_NAVIGATION_SCROLL = ()=>{

				if ( ! this.productGallery.querySelector('css-slider').sliderEnabled && window.innerWidth > 1023 ) {

					for ( const slide of reversedGallerySlides ) {
						const slideTop = slide.getBoundingClientRect().top;
						if ( slideTop < window.innerHeight / 2 && slideTop > -window.innerHeight / 2  ) {
							this.productGalleryNavigationItem.forEach(elm=>elm.classList.remove('active'));
							this.productGalleryNavigationItem[slide.dataset.index].classList.add('active');
							break;
						} 
					}

					const productGalleryTop = this.productGallery.getBoundingClientRect().top

					if ( (productGalleryTop - window.innerHeight) * -1 > this.productGallery.offsetHeight ) {
						this.productGalleryNavigation.classList.add('scroll');
					} else if ( productGalleryTop > 0 ) {
							this.productGalleryNavigation.classList.add('scroll-up');
						this.productGalleryNavigation.classList.add('scroll');
					} else if ( (productGalleryTop - window.innerHeight) * -1 < this.productGallery.offsetHeight ) {
						this.productGalleryNavigation.classList.remove('scroll');
						this.productGalleryNavigation.classList.remove('scroll-up');
					}

				}

			}

			window.addEventListener('scroll', this.GALLERY_NAVIGATION_SCROLL, {passive:true});
			this.GALLERY_NAVIGATION_SCROLL();

		}

	 	// Check for models

	 	const models = this.querySelectorAll('product-model');
	 	if ( models ) {
	 		window.ProductModel.loadShopifyXR();
	 		this.xrButton = this.querySelector('.product-gallery__view-in-space');
	 	}

	 	// hide buy now button if stock disabled

	 	const addToCartButton = this.querySelector('.product__add-to-cart');
	 	if ( addToCartButton ) {
	 		if ( addToCartButton.classList.contains('disabled') ) {
    		this.querySelector('product-form').classList.add('disable-buy-button');
    	} else {
    		this.querySelector('product-form').classList.remove('disable-buy-button');
    	}
		 	const buyObserver = new MutationObserver(mutations=>{
		    for ( const mutation of mutations ) {
		    	if ( addToCartButton.classList.contains('disabled') ) {
		    		this.querySelector('product-form').classList.add('disable-buy-button');
		    	} else {
		    		this.querySelector('product-form').classList.remove('disable-buy-button');
		    	}
		    }
		  });
		  buyObserver.observe(addToCartButton,{ attributes: true, childList: false, subtree: false });
		}

		// complementary products
		if ( this.querySelector('product-recommendations') ) {
			this.querySelector('product-recommendations').addEventListener('product-recommendations-loaded',e=>{
				window.preloadImages(e.target);
			})
		}

	}

	thumbnailNavigationHelper(index=0){ 
		this.querySelectorAll('.product-gallery__thumbnails .thumbnail').forEach((elm, i)=>{
			if ( i == index )
				elm.classList.add('active');
			else 
				elm.classList.remove('active');
		});
	}

	onVariantChangeHandler(e){
		let variant = e.target.currentVariant;
		if ( variant && variant.featured_media != null ) {
			let variantImg = this.productGallery.querySelector('.product-gallery__item[data-media-id="' + variant.featured_media.id + '"]');
			if ( variantImg ) {
				if ( this.productGallery.classList.contains('product-gallery--slider') || ( this.productGallery.classList.contains('product-gallery--scroll') && window.innerWidth < 1024 ) ) {
					if ( this.productGallery.querySelector('css-slider').sliderEnabled ) {
						this.productGallery.querySelector('css-slider').changeSlide(variantImg.dataset.index);
					}
				} else {
					window.scrollTo({
          	top: variantImg.offsetTop,
            behavior: 'smooth'
          });
				}
			}
		}
	}

}

customElements.define('product-page', ProductPage);

/* ---
	Product Reviews
--- */

class ProductReviews {

  constructor(_this){

    const observer = new MutationObserver((mutations, observer)=>{
      for ( const mutation of mutations ) {
        if ( mutation.addedNodes.length > 0 ) {
          mutation.addedNodes.forEach(elm=>{
            if ( elm.tagName == 'DIV' && elm.classList.contains('spr-container') ) {
            	this.init(elm);
              observer.disconnect();
            } 
          });
        }
      }
    })
  	if ( _this.querySelector('.spr-review') ) {
  		this.init(_this.querySelector('.spr-container'))
  	} else {
    	observer.observe(_this, {childList: true})
  	}
  }

  init(elm){

  	// create css slider for reviews

    if ( elm.querySelector('.spr-review') ) {

    	const reviews = elm.querySelector('.spr-reviews');
    	const reviewsSliderHolder = document.createElement('div');
	    reviewsSliderHolder.innerHTML = `<css-slider
	      class="spr-reviews css-slider--simple-dots" 
	      data-options='{
	        "selector": ".spr-review",
	        "navigation": false,
	        "groupCells": true,
	        "autoHeight": ${window.innerWidth<520?true:false}
	      }'>${reviews.innerHTML}</div>`

	    reviews.remove();
	    elm.querySelector('.spr-content').append(reviewsSliderHolder);

	    const reviewsSlider = reviewsSliderHolder.querySelector('css-slider');
	    setTimeout(()=>{
	      reviewsSlider.resetSlider(true);
	    }, 100);

	    // use jsonp to load more reviews

	    const paginationObserver = new IntersectionObserver((entries, observer)=>{
	      entries.forEach(entry=>{
	        if ( entry.isIntersecting ) {
	          if ( entry.target.querySelector('.spr-pagination-next a') ) {
	            const nextPage = entry.target.querySelector('.spr-pagination-next a');
	            getJSONP(`${SPR.api_url}/reviews?page=${nextPage.dataset.page}&product_id=${nextPage.dataset.productId}&shop=${window.location.hostname}&callback=?`, (data)=>
	              {
	                nextPage.closest('.spr-pagination').remove();
	                const innerHTML = new DOMParser().parseFromString(data.reviews, 'text/html');
	                if ( innerHTML.querySelectorAll('.spr-review, .spr-pagination') ) {
		                innerHTML.querySelectorAll('.spr-review, .spr-pagination').forEach(elm=>{
		                  reviewsSlider.querySelector('.css-slider-container').append(elm);
		                  if ( elm.classList.contains('spr-pagination') ) {
		                    paginationObserver.disconnect();
		                    paginationObserver.observe(elm);
		                  }
		                });
	                }
	                reviewsSlider.afterAppend();
	                reviewsSlider.resetSlider(true, false);
	              }
	            );
	          }
	        }
	      })
	    }, {threshold: 1});
	    if ( reviewsSliderHolder.querySelector('.spr-pagination') ) {
	      paginationObserver.observe(reviewsSliderHolder.querySelector('.spr-pagination'));
	    }

    } else {

    }

    // turn form into popup

    const reviewForm = document.createElement('div');
    reviewForm.id = 'spr-form-modal';
    reviewForm.innerHTML = `<div id="spr-form" class="spr-form-holder address-popup">
      <div class="basicLightboxClose" tabindex="0">×</div>
    </div>`;
    
    document.querySelector('.spr-summary-actions-newreview').setAttribute('onclick', '');
    const reviewModalForm = basicLightbox.create(reviewForm, {
			trigger: document.querySelector('.spr-summary-actions-newreview'),
			focus: 'input[type="text"]'
		});

    reviewModalForm.element().querySelector('.spr-form-holder').prepend(elm.querySelector('.spr-form'));
    reviewModalForm.element().querySelector('.spr-form').style.display = 'block';

  }

}

if ( document.getElementById('shopify-product-reviews') ) {
	new ProductReviews(document.getElementById('shopify-product-reviews'));
}

// product gallery helper

document.addEventListener('shopify:section:load', e=>{
  if ( e.target.classList.contains('mount-product-gallery') ) {
    ProductGalleryResizeHelper(e.target.querySelector('.product-gallery'));
  }
});
class GalleryZoom extends HTMLElement {
	constructor(){
		super();
		const modal = basicLightbox.create(`<img data-src="${this.dataset.src}" alt="" />`);
		this.addEventListener('click',e=>{
			e.preventDefault();
			const imgEl = modal.element().querySelector('img');
			imgEl.setAttribute('src', imgEl.dataset.src);
			modal.show();
		})
	}
}
customElements.define('gallery-zoom', GalleryZoom);
class ImageSlideshow extends CSSSlider {

	constructor(){

		super();

		this.slides = this.querySelectorAll('.slide');
		this.images = this.querySelectorAll('img');
		this.overlays = this.querySelectorAll('.slide__overlay');
		this.texts = this.querySelectorAll('.slide__text');

		if ( this.classList.contains('slider--scroll') ) {

			let previous = -1,
					currentOld = -1;

			// add navigation

			const sliderDots = document.createElement('div');
			sliderDots.classList.add('slider__dots');
			this.append(sliderDots);

			this.images.forEach((elm, i)=>{

				const sliderDot = document.createElement('div');
				sliderDot.classList.add('dot');
				sliderDots.append(sliderDot);

				sliderDot.addEventListener('click', ()=>{
					window.scrollTo({
						top: this.slides[i].offsetTop,
						behavior: 'smooth'
					})
				})

				if ( i == 0 ) {
					sliderDot.classList.add('active');
				}

			});

			this.sliderDot = this.querySelectorAll('.slider__dots .dot');
			this.sliderDots = this.querySelector('.slider__dots');

			// mount scroll event helper

			this.onScrollHandler = (()=>{

				var sliderOffset = this.offsetTop,
						scrollTop = window.scrollY,
						screenHeight = window.innerHeight;

				if ( scrollTop >= sliderOffset && scrollTop + screenHeight <= sliderOffset + this.offsetHeight ) {

					this.images.forEach((elm,i)=>{
						// animate each slide based on scrolling and it's offset
						const transformValue = ( scrollTop - sliderOffset - ( screenHeight * i ) ) / 2;
						if ( Math.abs(transformValue) <= screenHeight / 2 ) {
							this.scrollTransform(transformValue, this.images[i], this.overlays[i], this.texts[i]);
						} 

						if ( scrollTop >= ( screenHeight * i ) + sliderOffset - ( screenHeight / 2 ) && ! this.sliderDot[i].classList.contains('active') ) {
							this.sliderDots.querySelector('.active').classList.remove('active');
							this.sliderDot[i].classList.add('active');
						} 
					});

				} else if ( scrollTop < sliderOffset ) {
					// fix first slide
					this.scrollTransform(0, this.images[0], this.overlays[0], this.texts[0]);
				} else if ( scrollTop + screenHeight > sliderOffset + this.offsetHeight ) {
					// fix last slide
					this.scrollTransform(0, this.images[this.images.length-1], this.overlays[this.overlays.length-1], this.texts[this.texts.length-1]);
				}

				// Toggle slider navigation

				if ( this.sliderDots.classList.contains('in-view') && ( scrollTop + screenHeight > sliderOffset + this.offsetHeight || scrollTop < sliderOffset ) ) {
					this.sliderDots.classList.remove('in-view');
					if ( scrollTop < sliderOffset ) {
						this.sliderDots.classList.remove('in-bottom');
					} else if ( scrollTop + screenHeight > sliderOffset ) {
						this.sliderDots.classList.add('in-bottom');
					}
				} else if ( ! this.sliderDots.classList.contains('in-view') && ( scrollTop >= sliderOffset && scrollTop + screenHeight <= sliderOffset + this.offsetHeight ) ) {
					this.sliderDots.classList.add('in-view');
				}

			}).bind(this);
			window.addEventListener('scroll', this.onScrollHandler, {passive:true});
			this.onScrollHandler();

			this.addEventListener('ready', ()=>{
				this.images.forEach((elm,i)=>{
					this.scrollTransform(0, this.images[i], this.overlays[i], this.texts[i], true);
				});
			})

		}

		// mount resize event helper

		this.onResizeHandler = (()=>{
			if ( this.classList.contains('slider--scroll') ) {
				this.onScrollHandler();
			}
			if ( window.innerWidth < 948 && this.classList.contains('slider--mobile-js-height') && ( this.classList.contains('slider--horizontal') || this.classList.contains('slider--horizontal-mobile-true' ) ) ) {
				this.style.height = `${document.documentElement.clientHeight-this.dataset.navigationPadding}px`;
			}	
		}).bind(this);
		this.onResizeHandler();

		// add parallax effect to horizontal slider
		if ( ( this.classList.contains('slider--horizontal') || this.classList.contains('slider--horizontal-mobile-true') )
			&& ( "scrollBehavior" in document.documentElement.style || document.body.classList.contains('touch') )
		) {
			this.addEventListener('scroll', ()=>{
				const scrollX = -this.element.scrollLeft;
				this.slides.forEach((slide,i)=>{
			    const img = this.images[i];
			    if ( img ) {
			    	const slideX = slide.offsetLeft;
			    	img.style.transform = `translateX(${( slideX + scrollX ) * -1/3}px)`;
			    	this.texts[i].style.transform = `translateX${( slideX + scrollX ) / 8}px)`;
			    	this.overlays[i].style.opacity = `${( ( slideX + scrollX ) * -1/10 ) / 100}`;
			    }
		    });
			});
		}

	}

	scrollTransform(transformValue, image, overlay, text, force=false){
		if ( image && ( force || ( document.body.classList.contains('no-touch') && window.innerWidth > 948 ) ) ) {
			image.style.transform = `translate3d(0, ${transformValue}px, 0)`;
			if ( transformValue >= 0 ) {
				overlay.style.opacity = `${transformValue/(window.innerHeight/2)}`;
			}
			text.style.transform = `translate3d(0, ${transformValue/10}px, 0)`;
		}
	}

}
customElements.define('image-slideshow', ImageSlideshow);
KROWN.themeName = 'Kingdom';
KROWN.themeVersion = '4.3.5';

// Shopify events

document.addEventListener('shopify:section:load', e=>{
	window.reorderSections();
	window.preloadImages(e.target);
});
document.addEventListener('shopify:section:unload', e=>{
	window.reorderSections();
	window.preloadImages(e.target);
});
document.addEventListener('shopify:section:reoder', e=>{
	window.reorderSections();
	window.preloadImages(e.target);
});

const executeOnceOnDomContentLoaded = ()=>{

	// fit video aspect

	reframe(document.querySelectorAll('.rte iframe[src*="youtube"], .rte iframe[src*="vimeo"]'));

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
				window.preloadImages(cartItems);

				document.querySelector('.sidebar__cart').show();

		})

	}

}