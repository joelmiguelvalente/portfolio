(() => {

	const selectElement = (selector, all = false) => {
		selector = selector.trim();
		return all ? [...document.querySelectorAll(selector)] : document.querySelector(selector);
	};

	const selectElementById = (id) => {
		id = id.trim();
		return document.getElementById(id);
	};

	const on = (eventType, el, eventHandler, all = false) => {
		const selectedElements = selectElement(el, all);
		if (selectedElements) {
			all ? selectedElements.forEach(e => e.addEventListener(eventType, eventHandler)) : selectedElements.addEventListener(eventType, eventHandler);
		}
	};

	const onScroll = (el, listener) => el.addEventListener('scroll', listener);

	// === LIGHT/DARK MODE ===
	const dark = 'dark';
	const themeName = 'PortfolioMode';
	const selectedTheme = localStorage.getItem(themeName);
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const html = document.documentElement;

	const getCurrentTheme = () => html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

	const setTheme = (mode) => {
		html.setAttribute('data-theme', mode);
		localStorage.setItem(themeName, mode);
	};

	// Set theme based on stored value or user preference
	setTheme(selectedTheme || (prefersDark ? 'dark' : 'light'));

	const toggleTheme = () => setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');

	on('click', '[data-change-mode]', () => toggleTheme());
	document.onkeydown = (e) => {
		const { shiftKey, key } = e;
		if (shiftKey && (key === 'D' || key === 'd')) toggleTheme();
	};

	// === SCROLL-SPY ===
	const nav = selectElement('nav');
	const updateScrollSpy = () => {
		const position = window.scrollY + 200;
		const headerHeight = selectElement('header').offsetHeight;
		const toggleClass = position - 200 >= headerHeight ? 'add' : 'remove';
		nav.classList[toggleClass]('bg\:950','bg-opacity-8','shadow','rounded-md','backdrop-blur-12','top-1');

		selectElement('[data-link]', true).forEach(link => {
			if (!link.hash) return;
			const section = selectElement(link.hash);
			if (!section) return;

			const top = section.offsetTop;
			const bottom = top + section.offsetHeight;
			const isActive = position >= top && position <= bottom;
			link.classList.toggle('active', isActive);
		});
	};

	window.addEventListener('load', updateScrollSpy);
	onScroll(document, updateScrollSpy);

	// === SCROLL ===
	const scrollToElement = (el) => {
		const options = { top: selectElement(el).offsetTop, behavior: 'smooth' };
		window.scrollTo(options);
	};

	// === SVG ICON ===
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
				this.shadowRoot.innerHTML = svgText;
			} catch (error) {
				console.warn(`Error cargando el icono SVG: ${path}`, error);
				this.shadowRoot.innerHTML = `<span style="color:red;">❌</span>`;
			}
		}
	}

	customElements.define('svg-icon', SvgIcon);

	// === DECRYPT EFFECT ===
	const chars = "!@#$%&*_-+=<>?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	let current = 0;
	const hackElement = selectElementById("hack");
	const words = hackElement.dataset.list.split(',');

	function decryptEffect(word, callback) {
		let iterations = 0;
		const length = word.length;
		const interval = setInterval(() => {
			const revealed = word.split("").map((char, i) => {
				if (i < iterations) return char;
				return chars[Math.floor(Math.random() * chars.length)];
			}).join("");
			hackElement.textContent = revealed;
			iterations += 1 / 2; // Speed of reveal
			if (iterations >= length) {
				clearInterval(interval);
				hackElement.textContent = word;
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

	// === PAGE TITLE CHANGE ON FOCUS/BLUR ===
	window.onblur = () => document.title = "Por que no me ves?";
	window.onfocus = () => document.title = "Portfolio — JMV";

	// === LAZY LOAD ===
	const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const target = entry.target;
				target.classList.add('visible');
				target.classList.remove('oculto');

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

				observer.unobserve(target);
			}
		});
	}, { threshold: 0.1 });

	document.querySelectorAll('.observer').forEach(el => lazyLoadObserver.observe(el));

	// === FORMULARIO DE CONTACTO ===
	const form = document.getElementById("form");
  
 	async function handleSubmit(event) {
   	event.preventDefault();
   	let status = document.getElementById("my-form-status");
   	let data = new FormData(event.target);
   	fetch(event.target.action, {
   		method: form.method,
   		body: data,
   		headers: {
   		   'Accept': 'application/json'
   		}
   	}).then(response => {
   	  	if (response.ok) {
   	    	status.innerHTML = '¡Gracias por tu envío!';
   	    	form.reset()
   	  	} else {
   	   	response.json().then(data => {
   	   		status.innerHTML = Object.hasOwn(data, 'errors') ? data["errors"].map(error => error["message"]).join(", ") : '¡Uy! Hubo un problema al enviar tu formulario';
   	   	})
   	  	}
   	}).catch(error => status.innerHTML = '¡Uy! Hubo un problema al enviar tu formulario');
  }
  form.addEventListener("submit", handleSubmit)

})();