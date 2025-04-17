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
const playAgain = document.querySelector("#playAgain");
const volume = document.querySelector(".volume");
const hits = document.querySelector(".hints");
const hit_cols = document.querySelector("#hit");
const correct = document.querySelectorAll("[correct]");

let time = 20000;

let dragged = null;
let currentTouch = null;
let originalParent = null;
drops.forEach((el) => {
  el.classList.add("opacite-0");
  hits.classList.add("opacite-0");
});
video.addEventListener("canplaythrough", () => {
  video.muted = true;
  video.play();
});
video.addEventListener("ended", () => {
  video.pause();

  setTimeout(() => {
    videoContainer.classList.add("hidden");
    game.classList.remove("hidden");
  }, 1000);
});

function volumeUp() {
  let mute = video.muted;
  if (mute !== false) {
    volume.innerHTML = `<i class="bi bi-volume-up-fill"></i>`;
    video.muted = false;
  } else {
    volume.innerHTML = `<i class="bi bi-volume-mute-fill"></i>`;
    video.muted = true;
  }
}

const array = ["16.3%", "7%", "10.3%", "13.5%", "4.5%", "14.5%"];
function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const shuffledArray = shuffleArray(array);
text.textContent = "";
let timers = time;

function StartGame() {
  startGame.classList.add("hidden");
  beforStartImage.src = "assets/Image (1).png";
  hits.classList.remove("opacite-0");
  if (window.innerHeight <= 400) {
    beforStartImage.style.height = "113%";
  } else {
    beforStartImage.style.height = "102.5%";
  }
  drops.forEach((el) => {
    el.classList.remove("opacite-0");
    el.classList.add("opacite-1");
  });
  text.textContent = "";
  let gameInterval;
  timer.textContent = timers;
  gameInterval = setInterval(() => {
    if (timers > 0) {
      timers--;
      timer.textContent = timers;
      if (timers === 0) {
        setTimeout(() => {
          clearInterval(gameInterval);
          endCard.classList.remove("hidden");
          game.classList.add("hidden");
        }, 3000);
      }
    }
  }, 1000);
}
let hits_length = 5;
hit_cols.textContent = hits_length;
let correctS = null;
function TextHide() {
  if (hits_length <= 0) return;
  drop.forEach((el, i) => {
    const correctAttr = el.getAttribute("correct");

    if (correctAttr === "false" || !correctAttr) {
      el.textContent = shuffledArray[i];
      el.classList.add("text-opacity");
      el.style.color = "rgba(0, 0, 0, 0.41)";
      setTimeout(() => {
        el.classList.remove("text-opacity");
        el.style.color = "black";
        el.textContent = "";
        console.log("Timout");

        const droppedItem = el.querySelector("[data-drag]");
        if (droppedItem) {
          const cardContainers = document.querySelectorAll(".card");
          console.log("droppedItem");

          cardContainers[i].appendChild(droppedItem);
          Object.assign(droppedItem.style, {
            position: "",
            left: "",
            top: "",
            zIndex: "",
            pointerEvents: "",
          });
          dragged.style.position = "";
          dragged.style.left = "";
          dragged.style.top = "";
          dragged.style.zIndex = "";
          dragged.style.pointerEvents = "";
          droppedItem.removeAttribute("dragged");
        }
      }, 2000);
    }
  });

  hits_length--;
  hit_cols.textContent = hits_length;
}

drag.forEach((el, index) => {
  el.textContent = shuffledArray[index];
  el.setAttribute("data-drag", shuffledArray[index]);
});

drop.forEach((el, i) => {
  el.setAttribute("data-drop", shuffledArray[i]);
});

drag.forEach((elm) => {
  elm.addEventListener("dragstart", () => {
    dragged = elm;
    elm.classList.add("hold");
    setTimeout(() => elm.classList.add("invisible"), 0);
    elm.setAttribute("dragged", "drag");
  });

  elm.addEventListener("dragend", () => {
    elm.classList.remove("hold", "invisible");
    elm.classList.add("for-small");
  });

  elm.addEventListener("touchstart", (e) => {
    dragged = elm;
    currentTouch = e.touches[0];

    originalParent = elm.parentElement;
    document.body.appendChild(elm);

    elm.classList.add("for-touch");

    dragged.style.position = "absolute";
    dragged.style.zIndex = "1000";
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
    const expectedValue = dropTarget?.getAttribute("data-drop");
    const actualValue = elm.getAttribute("data-drag");

    if (dropTarget && dropTarget.getAttribute("id") === "drop") {
      dropTarget.appendChild(dragged);
      dragged.classList.add("for-notTouch");
      elm.classList.add("for-elm");
      elm.setAttribute("dragged", "drag");
    } else {
      if (originalParent) {
        originalParent.appendChild(dragged);
      }
    }

    // Сбросим стили
    dragged.style.position = "";
    dragged.style.left = "";
    dragged.style.top = "";
    dragged.style.zIndex = "";
    dragged.classList.remove("for-touch");

    console.log(expectedValue);
    console.log(actualValue);

    if (expectedValue === actualValue) {
      dropTarget?.setAttribute("correct", true);
    } else {
      dropTarget?.setAttribute("correct", false);
    }
    dragged = null;
    currentTouch = null;
    originalParent = null;
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
    const expectedValue = drp.getAttribute("data-drop");
    const actualValue = dragged.getAttribute("data-drag");
    drp.classList.remove("hovered");
    if (dragged) {
      drp.appendChild(dragged);
    }
    if (expectedValue === actualValue) {
      drp.setAttribute("correct", true);
    } else {
      drp.setAttribute("correct", false);
    }
  });
});

submit.addEventListener("click", () => {
  let allCorrect = true;
  let scores = 0;

  drop.forEach((dropzone) => {
    const unusedDrags = document.querySelectorAll("#drag:not([dragged])");
    if (unusedDrags.length > 0) {
      console.log("Не все элементы размещены!");
      return;
    }

    const expectedValue = dropzone.getAttribute("data-drop");
    const droppedItem = dropzone.querySelector("[data-drag]");

    dropzone.classList.remove("correct", "wrong");

    if (!droppedItem) {
      allCorrect = false;
      dropzone.classList.add("wrong");
      return;
    }

    const actualValue = droppedItem.getAttribute("data-drag");

    if (expectedValue === actualValue) {
      droppedItem.classList.add("green-text");
      dropzone.innerHTML += `<span class="check"><img src="assets/T.png" alt="correct" /></span>`;
      scores++;
      score.forEach((el) => {
        el.textContent = scores;
      });
      dropzone.setAttribute("correct", true);
    } else {
      droppedItem.classList.add("red-text");
      dropzone.innerHTML += `<span class="check"><img src="assets/X.png" alt="wrong" /></span>`;
      allCorrect = false;
      dropzone.setAttribute("correct", false);
    }

    if (allCorrect) {
      text.textContent = "WELL DONE!";
      submit.classList.add("green");
    } else {
      text.textContent = "OOPS... TRY AGAIN!";
      submit.classList.add("red");
    }
  });
});

function PlayAgain() {
  StartGame();
  game.classList.remove("hidden");
  endCard.classList.add("hidden");

  text.textContent = "";
  submit.classList.remove("green", "red");
  score.forEach((el) => (el.textContent = 0));

  timers = time;
  timer.textContent = timers;

  const dragCont = document.querySelectorAll(".card");
  drag.forEach((el, index) => {
    el.innerHTML = "";
    el.setAttribute("data-drag", shuffledArray[index]);
    el.classList.remove("green-text", "red-text", "invisible", "for-small");
    dragCont[index].appendChild(el);
    el.textContent = shuffledArray[index];
  });

  drop.forEach((el, i) => {
    el.innerHTML = "";
    el.setAttribute("data-drop", shuffledArray[i]);
    el.classList.add("opacite-1");
  });
}

volume.addEventListener("click", volumeUp);
playAgain.addEventListener("click", PlayAgain);
hits.addEventListener("click", TextHide);
playNow.addEventListener("click", StartGame);
