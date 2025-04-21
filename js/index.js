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

let time = 30;

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
  hits.classList.remove("opacite-0");
  if (window.innerHeight <= 400) {
    beforStartImage.style.height = "110%";
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
    const droppedItem = el.querySelector("[data-drag]");

    // Если correct=false или не задан
    if (correctAttr === "false" || !correctAttr) {
      el.textContent = shuffledArray[i];
      el.classList.add("text-opacity");
      el.style.color = "rgba(0, 0, 0, 0.41)";

      setTimeout(() => {
        el.classList.remove("text-opacity");
        el.textContent = "";

        // Если в drop что-то есть, и это неправильное — возвращаем
        if (droppedItem) {
          const cardContainers = document.querySelectorAll(".card");
          const originIndex = droppedItem.getAttribute("data-origin");
          const originContainer = cardContainers[originIndex];

          if (originContainer) {
            originContainer.appendChild(droppedItem);
            droppedItem.style.background = "#fff";
            droppedItem.classList.remove("for-small", "for-notTouch");
          }
          // Сбросим стили
          Object.assign(droppedItem.style, {
            position: "",
            left: "",
            top: "",
            zIndex: "",
            pointerEvents: "",
          });

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
  el.setAttribute("data-origin", index);
});

drop.forEach((el, i) => {
  el.setAttribute("data-drop", shuffledArray[i]);
});

let offsetX = 0;
let offsetY = 0;

function attachTouchEvents(elm) {
  elm.addEventListener("touchstart", (e) => {
    dragged = elm;
    currentTouch = e.touches[0];

    const rect = elm.getBoundingClientRect();
    offsetX = currentTouch.clientX - rect.left;
    offsetY = currentTouch.clientY - rect.top;

    if (elm.parentElement !== document.body) {
      originalParent = elm.parentElement;
      document.body.appendChild(elm);
    }

    elm.classList.add("for-touch");

    dragged.style.position = "absolute";
    dragged.style.zIndex = "1000";

    dragged.style.left = currentTouch.clientX - offsetX + "px";
    dragged.style.top = currentTouch.clientY - offsetY + "px";
  });

  elm.addEventListener("touchmove", (e) => {
    e.preventDefault();
    currentTouch = e.touches[0];
    dragged.style.left = currentTouch.clientX - dragged.offsetWidth / 2 + "px";
    dragged.style.top = currentTouch.clientY - dragged.offsetHeight / 2 + "px";
  });

  elm.addEventListener("touchend", (e) => {
    if (!currentTouch || !dragged) return;

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
      elm.style.background = "transparent";
    } else {
      if (originalParent) {
        originalParent.appendChild(dragged);
      }
    }

    dragged.style.position = "";
    dragged.style.left = "";
    dragged.style.top = "";
    dragged.style.zIndex = "";
    dragged.classList.remove("for-elm");
    dragged.classList.remove("for-touch");

    if (expectedValue === actualValue) {
      dropTarget?.setAttribute("correct", true);
    } else {
      dropTarget?.setAttribute("correct", false);
    }

    dragged = null;
    currentTouch = null;
    originalParent = null;
  });
}
function attachMouseEvents(elm) {
  elm.addEventListener("dragstart", () => {
    dragged = elm;
    elm.classList.add("hold");
    setTimeout(() => elm.classList.add("invisible"), 0);
    elm.setAttribute("dragged", "drag");
    elm.wasDropped = false;
  });

  elm.addEventListener("dragend", () => {
    elm.classList.remove("hold", "invisible");
    if (!elm.wasDropped) {
      elm.classList.remove("for-small");
      Object.assign(elm.style, {
        background: "#fff",
        position: "",
        left: "",
        top: "",
        zIndex: "",
        pointerEvents: "",
      });
    } else {
      elm.classList.add("for-small");
    }
  });
}
function attachMouseEventsDrop(drp) {
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

    if (!dragged) return;

    const expectedValue = drp.getAttribute("data-drop");
    const actualValue = dragged.getAttribute("data-drag");

    dragged.wasDropped = true;

    drp.appendChild(dragged);
    dragged.style.background = "transparent";

    if (expectedValue === actualValue) {
      drp.setAttribute("correct", true);
    } else {
      drp.setAttribute("correct", false);
    }
  });
}

drag.forEach((elm) => {
  attachMouseEvents(elm);
  attachTouchEvents(elm);
});

drop.forEach((drp) => {
  attachMouseEventsDrop(drp);
});

let allCorrect = true;
let scores = 0;

function Submit() {
  allCorrect = true; // сброс перед началом
  const unusedDrags = document.querySelectorAll("#drag:not([dragged])");
  if (unusedDrags.length > 0) {
    console.log("Не все элементы размещены!");
    text.textContent = "РАЗМЕСТИ ВСЕ ЭЛЕМЕНТЫ!";
    submit.classList.add("red");
    return;
  }

  drop.forEach((dropzone) => {
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
      dropzone.setAttribute("correct", true);
      scores++;
    } else {
      droppedItem.classList.add("red-text");
      dropzone.innerHTML += `<span class="check"><img src="assets/X.png" alt="wrong" /></span>`;
      dropzone.setAttribute("correct", false);
      allCorrect = false;

      const cardContainers = document.querySelectorAll(".card");
      const originIndex = droppedItem.getAttribute("data-origin");
      const originContainer = cardContainers[originIndex];

      setTimeout(() => {
        if (originContainer) {
          dropzone.innerHTML = "";
          originContainer.appendChild(droppedItem);
          droppedItem.style.background = "#fff";
          droppedItem.classList.remove("for-small", "red-text", "for-notTouch");
          droppedItem.classList.remove("red-text");
          droppedItem.removeAttribute("dragged");
        }
      }, 2000);

      Object.assign(droppedItem.style, {
        position: "",
        left: "",
        top: "",
        zIndex: "",
        pointerEvents: "",
      });

      droppedItem.removeAttribute("dragged");
    }
    drag.forEach((el) => {
      attachTouchEvents(el);
    });
  });
  document.querySelectorAll("#drag").forEach((el) => {
    attachTouchEvents(el);
    attachMouseEvents(el);
  });

  score.forEach((el) => {
    el.textContent = scores;
  });

  if (allCorrect) {
    text.textContent = "WELL DONE!";
    submit.classList.remove("red");
    submit.classList.add("green");
    setTimeout(() => {
      endCard.classList.remove("hidden");
      game.classList.add("hidden");
    }, 3000);
  } else {
    text.textContent = "OOPS... TRY AGAIN!";
    submit.classList.remove("green");
    submit.classList.add("red");
  }
  dragged = null;
  currentTouch = null;
  originalParent = null;
  allCorrect = true;
  offsetX = 0;
  offsetY = 0;
}

function PlayAgain() {
  StartGame();
  const newShuffled = shuffleArray(array);

  game.classList.remove("hidden");
  endCard.classList.add("hidden");

  text.textContent = "";
  submit.classList.remove("green", "red");
  score.forEach((el) => (el.textContent = 0));

  timers = time;
  timer.textContent = timers;
  hits_length = 5;
  hit_cols.textContent = hits_length;
  const dragCont = document.querySelectorAll(".card");

  dragCont.forEach((container, index) => {
    const oldDrag = container.querySelector("#drag");
    const newDrag = document.createElement("div");

    newDrag.id = "drag";
    newDrag.className = "item";
    newDrag.setAttribute("draggable", true);
    newDrag.setAttribute("data-drag", newShuffled[index]);
    newDrag.textContent = newShuffled[index];
    newDrag.style.background = "#fff";

    if (oldDrag) {
      container.replaceChild(newDrag, oldDrag);
    } else {
      container.appendChild(newDrag);
    }

    attachMouseEvents(newDrag);
    attachTouchEvents(newDrag);
  });

  drop.forEach((el, i) => {
    el.innerHTML = "";
    el.setAttribute("data-drop", newShuffled[i]);
    el.removeAttribute("correct");
    el.classList.remove("correct", "wrong");
  });
  for (let i = 0; i < shuffledArray.length; i++) {
    shuffledArray[i] = newShuffled[i];
  }
  dragged = null;
  currentTouch = null;
  originalParent = null;
  allCorrect = true;
  scores = 0;
  score.forEach((el) => {
    el.textContent = scores;
  });
  document.querySelectorAll("#drag").forEach((el) => {
    attachTouchEvents(el);
    attachMouseEvents(el);
  });
  offsetX = 0;
  offsetY = 0;
}
submit.addEventListener("click", Submit);
volume.addEventListener("click", volumeUp);
playAgain.addEventListener("click", PlayAgain);
hits.addEventListener("click", TextHide);
playNow.addEventListener("click", StartGame);
