import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

const swiper = new Swiper(".carousel", {
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
})