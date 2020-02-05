const body = document.querySelector('body');

const nav = document.querySelector('.navbar');

const triggerClose = document.querySelector('button.close');
const triggerOpen = document.querySelector('button.menu');

 
triggerClose.addEventListener('click', function(){
  nav.classList.remove('open')
  body.classList.remove('open')
});
triggerOpen.addEventListener('click', function(){
  nav.classList.add('open');
  body.classList.add('open');
});




