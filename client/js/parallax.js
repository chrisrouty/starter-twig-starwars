const parallaxEffect_1 = document.querySelectorAll('.banner .center');
const parallaxEffect_2 = document.querySelectorAll('.parallax');
// const encartPub = document.getElementsByClassName('.encart-pub img'); 

 
new simpleParallax(parallaxEffect_1, {
  delay: .3,
  scale: 1.5
});

new simpleParallax(parallaxEffect_2, {
  delay: .3,
  scale: 1.2
});

// new simpleParallax(encartPub, {
// 	overflow: true
// });