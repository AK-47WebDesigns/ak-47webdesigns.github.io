let offsetX = 0;
let offsetY = 0;
let isDragging = false;

const controller = document.getElementById('controller-container');
controller.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - controller.offsetLeft;
  offsetY = e.clientY - controller.offsetTop;
  controller.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  controller.style.left = `${e.clientX - offsetX}px`;
  controller.style.top = `${e.clientY - offsetY}px`;
  controller.style.right = 'auto'; 
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  controller.classList.remove('dragging');
});



let rafId = null;
let isRunning = false;
let currentIndex = 0;
const main = document.querySelector("main"); 
const sections = document.querySelectorAll('section');

// main.clientWidth -> width of main element (1383 px)
// main.scrollWidth -> width of main element's content (i.e. - all of the horizontal sections; total = 5532 px)
const autoScrollRight = () => {
  if (isRunning) {
    if (main.scrollLeft >= (main.scrollWidth - main.clientWidth)) {
      isRunning = false;
      cancelAnimationFrame(rafId);
      console.warn("End of horizontal scroll.");
      return;
    }

    main.scrollLeft += 10;
    currentIndex = Math.floor(main.scrollLeft / main.clientWidth);
    rafId = requestAnimationFrame(autoScrollRight);
  }
}

function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    currentIndex = index;
    const offset = sections[index].offsetLeft;

    const wasRunning = isRunning;
    isRunning = false;
    cancelAnimationFrame(rafId);
    main.scrollTo({ left: offset, behavior: 'smooth' });

    // stops auto-scroll (if running)
    // checks if scrolling has finished before restarting auto-scroll (if it was running)
    // used instead of "scrollend" event (due to lack of cross-browser support)
    const check = () => {
      const dx = Math.abs(main.scrollLeft - offset);
      if (dx <= 1) {
        if (wasRunning) {
          isRunning = true;
          autoScrollRight();
        }
      } else {
        requestAnimationFrame(check);
      }
    };

    requestAnimationFrame(check);
  }
}

// document.querySelector('#first').addEventListener('click', () => {
//   scrollToSection(0);
// });

// document.querySelector('#last').addEventListener('click', () => {
//   scrollToSection(sections.length - 1);
// });

// document.querySelector('#previous').addEventListener('click', () => {
//   let index = main.scrollLeft % main.clientWidth == 0 ? currentIndex - 1 : Math.floor(main.scrollLeft / main.clientWidth);
//   scrollToSection(index);
// });

// document.querySelector('#next').addEventListener('click', () => {
//   let index = main.scrollLeft % main.clientWidth == 0 ? currentIndex + 1 : Math.ceil(main.scrollLeft / main.clientWidth);
//   scrollToSection(index);
// });

document.querySelector('#start').addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    autoScrollRight();
  }
});

document.querySelector('#pause').addEventListener('click', () => {
  isRunning = false;
  cancelAnimationFrame(rafId);
});




let fadeTimeout;
const marios = document.getElementsByClassName("mario");
const baButtons = document.getElementsByClassName("ba-button");
const container = document.getElementById("bullet-holes-container");

for(const baButton of baButtons) {
  baButton.addEventListener('click', () => {
    console.log(baButton.id)
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
    marios[0].classList.add('flash')
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
  });
};
