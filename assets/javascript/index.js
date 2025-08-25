let rafId = null;
let isRunning = false;
const SCROLL_LEFT_ZERO = 0;
const main = document.querySelector("main"); 

const first = document.getElementById("first");
first.addEventListener('click', () => { 
  // main.scrollLeft = SCROLL_LEFT_ZERO; 
  isRunning = false; 
  main.scroll({
    left: hero.offsetLeft, 
    behavior: 'smooth'
  });
});

const pause = document.getElementById("pause");
pause.addEventListener('click', () => { isRunning = false; });

const last = document.getElementById("last");
last.addEventListener('click', () => {
  isRunning = false;
  main.scroll({
    left: contact.offsetLeft, 
    behavior: 'smooth'
  });
});


const play = document.getElementById("play");
play.addEventListener('click', () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId); 
  }

  isRunning = true; 
  rafId = requestAnimationFrame(autoScrollRight);
});


window.onload = () => {
  main.scrollLeft = SCROLL_LEFT_ZERO;
};


// main.clientWidth -> width of main element (1383 px)
// main.scrollWidth -> width of main element's content (i.e. - all of the horizontal sections; total = 5532 px)
const autoScrollRight = () => {
    console.log(main.scrollLeft, main.scrollWidth, main.clientWidth)
  if (isRunning) {
    if (main.scrollLeft >= (main.scrollWidth - main.clientWidth)) {
      console.warn("End of horizontal scroll.");
      return;
    }

    main.scrollLeft += 10;
    rafId = requestAnimationFrame(autoScrollRight);
  }
}

let fadeTimeout;
const marios = document.getElementsByClassName("mario");
const container = document.getElementById("bullet-holes-container");

for(const mario of marios) {
  mario.addEventListener('click', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const img = document.createElement("img");
    let randPic = Math.floor(Math.random() * 6) + 1;
    let randX = Math.floor(Math.random() * width) + 1;
    let randY = Math.floor(Math.random() * height) + 1;

    img.src = `assets/images/bullet-hole-${randPic}.png`;
    img.alt = `bullet-hole-${randPic}`;
    img.className = 'bullet-hole';
    img.classList.add('flash');
    img.style.left = `${randX}px`;
    img.style.top = `${randY}px`;
    img.style.opacity = '1';
    img.style.transition = 'opacity 3s ease'; 
    container.appendChild(img);

    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      const images = container.querySelectorAll('img');
      images.forEach(image => {
        image.style.opacity = '0';

        image.addEventListener('transitionend', () => {
          if (image.parentNode) {
            image.parentNode.removeChild(image);
          }
        });
      });
    }, 2000);
    
    // container.addEventListener('animationend', () => {
    //   container.classList.remove('flash');
    // }, { once: true });
  });
};
