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

document.querySelector('#up-arrow').addEventListener('click', () => {
  scrollToSection(0);
});

document.querySelector('#down-arrow').addEventListener('click', () => {
  scrollToSection(sections.length - 1);
});

document.querySelector('#left-arrow').addEventListener('click', () => {
  let index = main.scrollLeft % main.clientWidth == 0 ? currentIndex - 1 : Math.floor(main.scrollLeft / main.clientWidth);
  scrollToSection(index);
});

document.querySelector('#right-arrow').addEventListener('click', () => {
  let index = main.scrollLeft % main.clientWidth == 0 ? currentIndex + 1 : Math.ceil(main.scrollLeft / main.clientWidth);
  scrollToSection(index);
});

document.querySelector('#start-span').addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    autoScrollRight();
    main.classList.remove('paused');
  }
});

document.querySelector('#pause-span').addEventListener('click', () => {
  if (isRunning) {
    main.classList.add('paused');
  }
  isRunning = false;
  cancelAnimationFrame(rafId);
});




let fadeTimeout;
let activeTimeout;
const marios = document.getElementsByClassName("mario");
const baButtons = document.getElementsByClassName("ba-button");
const bhContainer = document.getElementById("bullet-holes-container");
const letters = document.querySelectorAll(".letter");

for(const baButton of baButtons) {
  baButton.addEventListener('click', () => {
    const width = bhContainer.offsetWidth;
    const height = bhContainer.offsetHeight;

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
    bhContainer.appendChild(img);

    const bulletRect = img.getBoundingClientRect();
    const bulletX = bulletRect.left + bulletRect.width / 2;
    const bulletY = bulletRect.top + bulletRect.height / 2;

    letters.forEach(letter => {
      const letterRect = letter.getBoundingClientRect();
      const shrinkX = letterRect.width * 0.05;   
      const shrinkY = letterRect.height * 0.05; 

      const hitbox = {
        left: letterRect.left + shrinkX,
        right: letterRect.right - shrinkX,
        top: letterRect.top + shrinkY,
        bottom: letterRect.bottom - shrinkY
      };

      const inside =
        bulletX >= hitbox.left &&
        bulletX <= hitbox.right &&
        bulletY >= hitbox.top &&
        bulletY <= hitbox.bottom;

      if (inside) {
        const direction = Math.random() < 0.5 ? 1 : -1;
        const deg = (Math.floor(Math.random() * 6) + 1) * 360;
        const duration = (Math.floor(Math.random() * 11) + 5) / 10;
        // letter.style.setProperty('--spin-deg', `${direction * deg}deg`);

        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
          @keyframes rotateY {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(${direction * deg}deg); }
          }
        `, styleSheet.cssRules.length);

        letter.style.animation = `rotateY ${duration}s ease`;
        letter.addEventListener("animationend", () => {
          letter.style.animation = '';
        }, { once: true });
      }
    });

    const targetId = baButton.dataset.target;
    const targetImg = document.getElementById(targetId);
    targetImg.style.transform = `translateX(${targetId === 'left-mario' ? '-' : ''}10px)`;
    targetImg.style.filter = 'brightness(125%)';
    targetImg.style.opacity = '0.9';

    clearTimeout(activeTimeout);
    activeTimeout = setTimeout(() => {
      targetImg.style.transform = ''; 
      targetImg.style.filter = '';
      targetImg.style.opacity = '';
    }, 75);

    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      const images = bhContainer.querySelectorAll('img');
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

const section = document.querySelector("#contact");
const cursor = document.getElementById("fairy-cursor");

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

section.addEventListener("mouseenter", () => cursor.classList.add("active"));
section.addEventListener("mouseleave", () => cursor.classList.remove("active"));


const intro = document.getElementById("intro-container");
const about = document.getElementById("about-container");

intro.addEventListener("animationend", () => {
  controller.style.display = "flex";
  about.style.display = "block";
});

document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    document.querySelectorAll('.skill-box').forEach(box => {
      const title = box.querySelector('.skill-box-title');
      if (!title) return; 
      const gap = title.offsetWidth + 16;
      box.style.setProperty('--skill-box-title-gap', gap + 'px');
    });
  });
});


function openTab(event, tab) {
  let grids = document.getElementsByClassName("grid");
  for (let i = 0; i < grids.length; i++) {
    grids[i].style.display = "none";
  }

  let tabInfo = document.getElementsByClassName("tab-info");
  for (let i = 0; i < tabInfo.length; i++) {
    tabInfo[i].style.display = "none";
  }

  let tabLinks = document.getElementsByClassName("tab-link");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  let elements = document.querySelectorAll(`#${tab}`);
  for(let node of elements) {
    node.style.display = "grid";
  }

  event.currentTarget.className += " active";
} 


const container = document.getElementById('projects-container');
const wrappers = document.querySelectorAll('.scene-wrapper');
wrappers.forEach(wrapper => {
  wrapper.addEventListener('click', () => {
    wrappers.forEach(w => {
      if (w !== wrapper) w.classList.remove('pulled');
    });

    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const deltaX = containerRect.left - (wrapperRect.left + wrapperRect.width / 2);
    const deltaY = (containerRect.top - wrapperRect.top) / 2;

    wrapper.classList.toggle('pulled');
    wrapper.style.setProperty('--pull-delta-x', `${deltaX}px`);
    wrapper.style.setProperty('--pull-delta-y', `${deltaY}px`);
  });
});


const sceneWrapper = document.querySelector('.scene-wrapper');
const faceHeight = sceneWrapper.offsetHeight * 0.8;
document.documentElement.style.setProperty('--face-height', `${faceHeight}px`);
