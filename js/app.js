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
	const onscroll = (el, listener) => el.addEventListener('scroll', listener);

	// === LIGHT/DARK ===
	const dark = 'dark',
   name = 'PortfolioMode',
   selected = localStorage.getItem(name),
   userHasDark = window.matchMedia('(prefers-color-scheme: dark)').matches,
   html = document.documentElement,
   getCurrent = () => html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

	const setTheme = (mode) => {
	  html.setAttribute('data-theme', mode);
	  localStorage.setItem(name, mode);
	};

	if (selected) {
	  setTheme(selected);
	} else {
	  setTheme(userHasDark ? 'dark' : 'light');
	}

	// Esta función la usás cuando el usuario quiere cambiar manualmente:
	const toggleTheme = () => {
	  const newMode = getCurrent() === 'dark' ? 'light' : 'dark';
	  setTheme(newMode);
	};

	on('click', '[data-change-mode]', () => toggleTheme())
	document.onkeydown = tecla => {
		const { shiftKey, key } = tecla;
		if (shiftKey && (key === 'D' || key === 'd')) toggleTheme();
	}

	// === SCROLL-SPY ===
	const navbarlinks = element('[data-link]', true); 
	const nav = element('nav');
	const header = element('header');
	const updateScrollSpy = () => {
		const position = window.scrollY + 200;
		// Añadir la clase .bg-full a nav 
		const headerHeight = header.offsetHeight;

		// Agregar/quitar fondo al nav de forma estable
		if ((position - 200) >= headerHeight) {
		 	nav.classList.add('bg-full');
		} else {
		  	nav.classList.remove('bg-full');
		}

		navbarlinks.forEach(link => {
			if (!link.hash) return;
			const section = element(link.hash);
			if (!section) return;

			const top = section.offsetTop;
			const bottom = top + section.offsetHeight;
			const isActive = position >= top && position <= bottom;
			link.classList.toggle('active', isActive);
		});
	};

	window.addEventListener('load', updateScrollSpy);
	onscroll(document, updateScrollSpy); // asumo que esta función ya existe en tu código

	// --------- SCROLL
	const scrollto = el => {
	 	let elementPos = element(el).offsetTop;
	 	let option = {
			top: elementPos,
			behavior: 'smooth'
	 	};
	 	window.scrollTo(option);
	}

	class SvgIcon extends HTMLElement {
	  	constructor() {
	   	super();
	    	this.attachShadow({ mode: 'open' });
	  	}
	  	async connectedCallback() {
	    	const path = this.getAttribute('name');
	    	if (!path) return;
	    	try {
	      	const response = await fetch(path);
	      	const svgText = await response.text();
	      	this.shadowRoot.innerHTML = `${svgText}`;
	    	} catch (error) {
	      	console.warn(`Error cargando el icono SVG: ${path}`, error);
	      	this.shadowRoot.innerHTML = `<span style="color:red;">❌</span>`;
	    	}
	  	}
	}
	customElements.define('svg-icon', SvgIcon);

	const words = [
		"Programador",
		"Desarrollador",
		"Entusiasta en PHP",
		"Autodidacta",
		"Curioso por naturaleza"
	];
	const chars = "!@#$%&*_-+=<>?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

	let current = 0;
	const el = document.getElementById("hack");

	function decryptEffect(word, callback) {
	  	let iterations = 0;
	  	const length = word.length;
	  	const interval = setInterval(() => {
	    	const revealed = word.split("").map((char, i) => {
	        	if (i < iterations) return char;
	        	return chars[Math.floor(Math.random() * chars.length)];
	      }).join("");
	      el.textContent = revealed;
	      iterations += 1 / 2; /* Velocidad del revelado */
	    	if (iterations >= length) {
	      	clearInterval(interval);
	     		el.textContent = word;
	      	if (callback) setTimeout(callback, 1500); 
	    	}
	  	}, 80); 
	}
	function loopWords() {
	  	decryptEffect(words[current], () => {
	    	current = (current + 1) % words.length;
	    	loopWords();
	  	});
	}
	loopWords();


	window.onblur = () => document.title = "Por que no me ves?";
	window.onfocus = () => document.title = "Porfolio — JMV";

	const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const target = entry.target;
				target.classList.add('visible');
				target.classList.remove('oculto');

				// Cargar imagen real si tiene data-src
				const img = target.querySelector('img[data-src]');
				const source = target.querySelector('source[data-srcset]');

				if (img) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
				}
				if (source) {
					source.srcset = source.dataset.srcset;
					source.removeAttribute('data-srcset');
				}

				observer.unobserve(target); // ahora sí funciona bien
			}
		});
	}, { threshold: 0.1 });

	document.querySelectorAll('.observer').forEach(el => lazyLoadObserver.observe(el));

	// Inicializa EmailJS con tu user_id
	const publicKey = "wH5uyj09RAzD_BaGT";
	const serviceKey = "service_ga4ppun";
	const templateKey = "template_2lnrqqy";

	emailjs.init({ publicKey });

	// Obtén el formulario
	const form = document.getElementById('contact-form');
	// Maneja el envío del formulario
	form.addEventListener('submit', function (event) {
	  	event.preventDefault();
	  	// Recolecta los datos del formulario
	  	const formData = {
	   	name: document.getElementById('name').value,
	   	email: document.getElementById('email').value,
	   	message: document.getElementById('message').value
	  	};
		// Muestra un mensaje de "enviando..."
		const statusMessage = document.getElementById('status-message');
		statusMessage.innerHTML = 'Enviando...';
		// Enviar el correo a través de EmailJS
		emailjs.send(serviceKey, templateKey, formData)
		.then(function(response) {
		   console.log('Success:', response);
		   statusMessage.innerHTML = '¡Mensaje enviado con éxito!';
		   form.reset(); // Resetea el formulario después del envío
		 }, function(error) {
		   console.log('Error:', error);
		   statusMessage.innerHTML = 'Hubo un error, intenta de nuevo más tarde.';
		});
	});

})();