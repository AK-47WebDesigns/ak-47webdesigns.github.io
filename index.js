let rafId = null;
let isRunning = false;
const SCROLL_LEFT_ZERO = 0;
const main = document.querySelector("main"); 

const restart = document.getElementById("restart");
restart.addEventListener('click', () => { main.scrollLeft = SCROLL_LEFT_ZERO; isRunning = false; });

const pause = document.getElementById("pause");
pause.addEventListener('click', () => { isRunning = false; });


const playScroll = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId); 
  }

  isRunning = true; 
  rafId = requestAnimationFrame(autoScrollRight);
}

const play = document.getElementById("play");
play.addEventListener('click', playScroll);


window.onload = () => {
  main.scrollLeft = SCROLL_LEFT_ZERO;
};


// main.clientWidth -> width of main element (1383 px)
// main.scrollWidth -> width of main element's content (i.e. - all of the horizontal sections; total = 5532 px)
const autoScrollRight = () => {
  if (isRunning) {
    if (main.scrollLeft >= (main.scrollWidth - main.clientWidth)) {
      console.warn("End of horizontal scroll.");
      return;
    }

    main.scrollLeft += 10;
    rafId = requestAnimationFrame(autoScrollRight);
  }
}




// // Initialize GSAP timeline
// const tl = gsap.timeline({
//   defaults: { ease: "power2.out" }
// });

// // Step 1: Logo fade in (pixelated)
// tl.to("#logo", { opacity: 1, duration: 0.5, scale: 1.1 });

// // Step 2: Bullet impact sequence
// // You can trigger multiple impacts
// for (let i = 0; i < 5; i++) {
//   tl.to("#logo", { rotation: "+=2", duration: 0.05 })
//     .to("#logo", { rotation: "-=2", duration: 0.05 })
//     .to("#logo", { scale: 1.05, duration: 0.05 })
//     .to("#logo", { scale: 1.1, duration: 0.05 });
// }

// // Optional: particle/bullet effect via canvas
// // (Use a simple function to spawn small circles or squares around logo)

// // Step 3: Polish / reveal final logo
// tl.to("#logo", { scale: 1, duration: 0.3 })
//   .to("#logo", { filter: "blur(0px)", duration: 0.3 })
//   .to("#logo", { opacity: 1, duration: 0.3 });

// // Step 4: Reveal hero content
// tl.to("#hero", { display: "block", opacity: 1, duration: 0.5 });


// const canvas = document.getElementById("bg-canvas");
// const ctx = canvas.getContext("2d");

// function spawnBulletHole(x, y) {
//   ctx.fillStyle = "#fff";
//   ctx.fillRect(x, y, 4, 4); // small square pixel
// }

// // Randomly spawn 5 bullets around logo
// for (let i = 0; i < 5; i++) {
//   spawnBulletHole(200 + Math.random() * 200, 200 + Math.random() * 200);
// }
