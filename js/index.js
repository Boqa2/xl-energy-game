const video = document.querySelector("#video");
const videoContainer = document.querySelector(".video");
const game = document.querySelector("#game");
const beforStartImage = document.querySelector("#beforStart");
const drop = document.querySelectorAll("#drop");
const drops = document.querySelectorAll("#drops");
const drag = document.querySelectorAll("#drag");
const timer = document.querySelector("#timer");
const score = document.querySelectorAll("#score");
const text = document.querySelector("#text");
const submit = document.querySelector("#submit");
const startGame = document.querySelector("#startGame");
const playNow = document.querySelector("#playNow");
const endCard = document.querySelector("#endCard");

let time = 20;
drops.forEach((el) => {
  el.classList.add("hidden");
});
video.addEventListener("canplaythrough", () => {
  video.play();
});
video.addEventListener("ended", () => {
  video.pause();

  setTimeout(() => {
    videoContainer.classList.add("hidden");
    game.classList.remove("hidden");
  }, 1000);
});

text.textContent = "";
function StartGame() {
  startGame.classList.add("hidden");
  beforStartImage.src = "assets/Image (1).png";
  beforStartImage.style.height = "102.5%";

  drops.forEach((el) => {
    el.classList.remove("hidden");
  });
  text.textContent = "";
  let gameInterval;
  let timers = time;
  timer.textContent = timers;
  gameInterval = setInterval(() => {
    if (timers > 0) {
      timers--;
      timer.textContent = timers;
    } else {
      clearInterval(gameInterval);
    }
  }, 1000);
}
playNow.addEventListener("click", StartGame);

const array = ["16.3%", "7%", "10.3%", "13.5%", "4.5%", "14.5%"];

drag.forEach((el, index) => {
  for (let i = 0; i < array.length; i++) {
    el.textContent = array[index];
    el.setAttribute("data-drag", array[index]);
  }
});

drop.forEach((el, i) => {
  for (let ind = 0; ind < array.length; ind++) {
    el.setAttribute("data-drop", array[i]);
  }
});
let dragged = null;
let currentTouch = null;

drag.forEach((elm) => {
  elm.addEventListener("dragstart", () => {
    dragged = elm;
    elm.classList.add("hold");
    setTimeout(() => elm.classList.add("invisible"), 0);
  });

  elm.addEventListener("dragend", () => {
    elm.classList.remove("hold", "invisible");
    elm.classList.add("for-small");
  });

  elm.addEventListener("touchstart", (e) => {
    dragged = elm;
    currentTouch = e.touches[0];
    elm.style.position = "absolute";
    elm.style.zIndex = "1000";
  });

  elm.addEventListener("touchmove", (e) => {
    e.preventDefault();
    currentTouch = e.touches[0];
    dragged.style.left = currentTouch.clientX - dragged.offsetWidth / 2 + "px";
    dragged.style.top = currentTouch.clientY - dragged.offsetHeight / 2 + "px";
  });

  elm.addEventListener("touchend", (e) => {
    const x = currentTouch.clientX;
    const y = currentTouch.clientY;

    const dropTarget = document.elementFromPoint(x, y);

    if (dropTarget && dropTarget.classList.contains("drop")) {
      dropTarget.appendChild(dragged);
      dragged.style.position = "";
      dragged.style.left = "";
      dragged.style.top = "";
      dragged.style.zIndex = "";
    }

    dragged = null;
    currentTouch = null;
  });
});

drop.forEach((drp) => {
  drp.addEventListener("dragenter", (e) => {
    e.preventDefault();
    drp.classList.add("hovered");
  });

  drp.addEventListener("dragleave", () => {
    drp.classList.remove("hovered");
  });

  drp.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  drp.addEventListener("drop", () => {
    drp.classList.remove("hovered");
    if (dragged) {
      drp.appendChild(dragged);
    }
  });
});
let scores = 0;
score.forEach((els) => {
  els.textContent = scores;
  
});
submit.addEventListener("click", () => {
  let allCorrect = true;

  drop.forEach((dropzone) => {
    const expectedValue = dropzone.getAttribute("data-drop");
    const droppedItem = dropzone.querySelector("[data-drag]");

    console.log(droppedItem);

    dropzone.classList.remove("correct", "wrong");

    if (!droppedItem) {
      allCorrect = false;
      dropzone.classList.add("wrong");
      return;
    }

    const actualValue = droppedItem.getAttribute("data-drag");

    if (expectedValue === actualValue) {
      dropzone.classList.add("correct");
      droppedItem.classList.add("green-text");
      dropzone.innerHTML += `<span class="check"><img src="assets/T.png" alt="correct" /></span>`;
      scores++;
    } else {
      dropzone.classList.add("wrong");
      droppedItem.classList.add("red-text");
      dropzone.innerHTML += `<span class="check"><img src="assets/X.png" alt="wrong" /></span>`;
      allCorrect = false;
    }
  });

  if (allCorrect) {
    text.textContent = "WELL DONE!";
    submit.classList.add("green");
  } else {
    text.textContent = "OOPS... TRY AGAIN!";
    submit.classList.add("red");
  }
});
