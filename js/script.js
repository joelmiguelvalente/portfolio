(() => {
	const element = (el, all = false) => {
		el = el.trim()
		return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
	}
	const on = (type, el, event, all = false) => {
		selectEl = element(el, all);
	 	if (selectEl) {
		 	all ? selectEl.forEach(e => e.addEventListener(type, event)) : selectEl.addEventListener(type, event)
		}
	}
	const onscroll = (el, listener) => el.addEventListener('scroll', listener)

	// --------- CAMBIAR MODO LIGHT/DARK
	const dark = 'dark',
	name = 'selected-theme',
	selected = localStorage.getItem(name),
	userHasDark = window.matchMedia('(prefers-color-scheme: dark)').matches,
	getCurrent = () => document.body.classList.contains(dark) ? 'dark' : 'light';
	bodyclass = d => {
		document.body.classList.toggle(dark)
	  	localStorage.setItem(name, getCurrent())
	}
	if (selected) document.body.classList[selected === 'dark' ? 'add' : 'remove'](dark)
	else {
		if (userHasDark) document.body.classList.add(dark)
	}
	on('click', '.cambiar-modo span', () => bodyclass(dark))
	document.onkeydown = tecla => {
		// ----------- SHIFT + D -----------
		if (tecla.shiftKey) {
		   if (tecla.keyCode == 68 || event.keyCode == 100) bodyclass(dark)
		}
	}

	// --------- ABRIR/CERRAR MENU
	on('click', '.span-menu', e => e.target.parentElement.classList.toggle('open-menu'))

	let navbarlinks = element('.menu .menu-link', true)
	  	const navbarlinksActive = () => {
	 	let position = window.scrollY + 200
	 	navbarlinks.forEach(navbarlink => {
			if (!navbarlink.hash) return
			let section = element(navbarlink.hash)
			if (!section) return
			if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
		  		navbarlink.classList.add('active')
			} else {
		  		navbarlink.classList.remove('active')
			}
	 })
	}
	window.addEventListener('load', navbarlinksActive)
	onscroll(document, navbarlinksActive)

	// --------- CAMBIAR IDIOMA
	on('click', '.idiomas', e => {
		e.target.parentElement.classList.toggle('abrir')
		if(e.target.parentElement.dataset.lang !== undefined) lang(e.target.parentElement.dataset.lang)
	})
	on('click', '.lng', e => {
		if(!element(".idiomas").classList.contains('abrir')) lang(e.target.dataset.lang)
	}, true);

	const scrollto = (el) => {
	 	let elementPos = element(el).offsetTop
	 	window.scrollTo({
			top: elementPos,
			behavior: 'smooth'
	 	})
	}
	// ---------- Cargamos idioma
	let getLang = localStorage.getItem("idioma")
	if(getLang === null) {
		getLang = 'es'
		localStorage.setItem('idioma', getLang)
	}
	lang(getLang)
	async function lang(ln = 'es', reload = false) {
		// Guardamos el cambio del idioma!
		localStorage.setItem('idioma', ln)
		// Generamos la petición
		const newurl = location.origin + location.pathname;
		const getLang = await fetch(`${newurl}langs/${ln}.json`)
		const getData = await getLang.json()
		// Asignamos el texto correspondiente a la posicion
		element('.ln_data_soy').innerHTML = '';
		Object.keys(getData.data).map((key, value) => {
			let nKey = "." + key;
			let nVal = getData.data[key];
			let type = key.split('_')[1];
			if(type === 'alt') {
				element(nKey).setAttribute('alt', nVal);
				element(nKey).setAttribute('title', nVal);
			} 
			else if(type === 'data') document.querySelector(nKey).setAttribute('data-items', nVal);
			else if(type === 'html') element(nKey).innerHTML = nVal;
		})
		new Typed('.ln_data_soy', {
			strings: getData.data.ln_data_soy.split(','),
			typeSpeed: 100,
			backSpeed: 50,
			backDelay: 2000,
			fadeOut: true,
			loop: true
		});
	}

	var swiper = new Swiper(".carousel", {
	  	effect: "coverflow",
	  	grabCursor: true,
	  	centeredSlides: true,
	  	slidesPerView: "auto",
	   autoplay: {
	     	delay: 2500,
	     	disableOnInteraction: false,
	   },
	  	coverflowEffect: {
	  		rotate: 50,
	  		stretch: 0,
	  		depth: 100,
	  		modifier: 1,
	  		slideShadows: true,
	  	},
	});

	on('click', '.footer-socials .social', e => {
		fetch(`${location.origin}${location.pathname}social.json`)
		.then(get => get.json())
		.then(red => window.open(red[e.target.classList[1]], '_blank'))
	}, true)

	window.onblur = () => document.title = "Por que no me ves?";
	window.onfocus = () => document.title = "Porfolio — JMV";

	AOS.init();

	// ---------- Cargamos lazyload
	const LazyLoadClass = ['.image', '.background', '.iframe']
	LazyLoadClass.map( lazyload => {
		let NewOptions = {
	      elements_selector: lazyload,
	      use_native: true,
	      class_loading: 'lazy-loading',
	      callback_error: callback => {
			   callback.setAttribute("srcset", "http://ui-avatars.com/api/?name=Imagen&background=330000&color=ffffff");
			   callback.setAttribute("src", "http://ui-avatars.com/api/?name=Imagen&background=333333&color=ffffff");
			}
	   }
	   if(lazyload === '.background') {
	      // Agregamos
	      NewOptions = Object.assign(NewOptions, {class_loaded: 'lazy-loaded'})
	      // Quitamos -> use_native: true
	      delete NewOptions.use_native
	   }
	   new LazyLoad(NewOptions)
	})
})()