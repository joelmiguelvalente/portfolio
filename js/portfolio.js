const select = (el, all = false) => {
	el = el.trim()
	return all ? [...document.querySelectorAll(el)] : document.querySelector(el)
}

const storage = (name, action = 'get', data = '') => {
	(action === 'get') ? localStorage.getItem(name) : localStorage.setItem(name, data);
}

const on = (type, el, listener, all = false) => {
 	let selectEl = select(el, all)
 	if (selectEl) {
		all ? selectEl.forEach(e => e.addEventListener(type, listener)) : selectEl.addEventListener(type, listener)
 	}
}

const onscroll = (el, listener) => el.addEventListener('scroll', listener)

let navbarlinks = select('.menu .ScrollTo', true)
  	const navbarlinksActive = () => {
 	let position = window.scrollY + 200
 	navbarlinks.forEach(navbarlink => {
		if (!navbarlink.hash) return
		let section = select(navbarlink.hash)
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

const scrollto = (el) => {
 	let elementPos = select(el).offsetTop
 	window.scrollTo({
		top: elementPos,
		behavior: 'smooth'
 	})
}
on('click', '.ScrollTo', e => {
	if (select(e.target.hash)) {
		e.preventDefault()
		scrollto(e.target.hash)
	}
}, true)

if(screen.width <= 425) {
	on('click', 'img.navbar-img', e => {
		e.target.parentElement.classList.toggle('navbar-open')
	})
}

// ---------- Cargamos idioma
let getLang = localStorage.getItem("idioma")
if(getLang !== null) {
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
	Object.keys(getData.data).map((key, value) => {
		var nKey = "." + key;
		var nVal = getData.data[key];
		if(key === 'ln_menu_home' || key === 'ln_menu_about' || 
			key === 'ln_menu_skill' || key === 'ln_menu_proyect' || key === 'ln_menu_contact') {
			//select(nKey).setAttribute("alt", nVal)
			//select(nKey).setAttribute("title", nVal)
			//select(nKey + " span").innerHTML = nVal
		} else if(key === 'ln_img') {
			const images = [].slice.call(select(nKey, true));
			//images.map( img => img.setAttribute("alt", nVal))
		} else {
			//select(nKey).innerHTML = nVal
		}
	})
	// Generamos el tipeado
	/*const tipeando = new Typed('.dentroyosoy', {
		strings: getData.data.ln_html_3.split(','),
		typeSpeed: 100,
		backSpeed: 50,
		backDelay: 2000,
	   fadeOut: true,
	   loop: true
	});
	if(reload) {
		tipeando.destroy();
		setTimeout(() => tipeando.start(), 1500)
	}*/
}

const idiomas = [].slice.call(select(".seleccionar_idioma > span", true)).map( lns => lns.onclick = e => lang(e.target.id, true))
// ------------------------------------
const dark = 'dark',
selected = localStorage.getItem('selected-theme'),
userHasDark = window.matchMedia('(prefers-color-scheme: dark)').matches,
getCurrent = () => document.body.classList.contains(dark) ? 'dark' : 'light';

if (selected) {
	document.body.classList[selected === 'dark' ? 'add' : 'remove'](dark)
} else {
	if (userHasDark) document.body.classList.add(dark)
}
on('click', '#theme-button', () => {
  document.body.classList.toggle(dark)
  localStorage.setItem('selected-theme', getCurrent())
})
// ------------------------------------
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


//
AOS.init();