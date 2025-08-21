let rafId = null;
let isRunning = false;
const SCROLL_LEFT_ZERO = 0;
const main = document.querySelector("main"); 

const restart = document.getElementById("restart");
restart.addEventListener('click', () => { 
  // main.scrollLeft = SCROLL_LEFT_ZERO; 
  isRunning = false; 
  main.scroll({
    left: hero.offsetLeft, 
    behavior: 'smooth'
  });
});

const pause = document.getElementById("pause");
pause.addEventListener('click', () => { isRunning = false; });

const end = document.getElementById("end");
end.addEventListener('click', () => {
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