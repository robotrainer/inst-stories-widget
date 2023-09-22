let timer;

document.querySelector(".player-chunk-prev").addEventListener("click", prev);
document.querySelector(".player-chunk-next").addEventListener("click", next);

runInterval(2, 1);

function moveClass(className, method, pred) {
  const elem = document.querySelector("." + className);
  const elementSibling = elem[method];

  if (pred && !pred(elem)) {
    return null;
  }

  if (elementSibling) {
    elem.classList.remove(className);
    elementSibling.classList.add(className);

    return elem;
  }

  return null;
}

function next() {
  moveClass("player-chunk-active", "nextElementSibling");
  const el = moveClass("timeline-chunk-active", "nextElementSibling");

  if (el) {
    el.querySelector(".timeline-chunk-inner").style.width = "";
  }
}

function prev() {
  const el = moveClass("timeline-chunk-active", "previousElementSibling", (el) => {
    const inner = el.querySelector(".timeline-chunk-inner");
    const w = parseFloat(inner.style.width) || 0;

    inner.style.width = "";

    return w <= 20;
  });

  if (el) {
    moveClass("player-chunk-active", "previousElementSibling");
  }
}

function runInterval(time, step) {
  clearInterval(timer);

  timer = setInterval(() => {
    const active = document
      .querySelector(".timeline-chunk-active")
      .querySelector(".timeline-chunk-inner");
    const w = parseFloat(active.style.width) || 0;
  
    if (w === 100) {
      next();
      return;
    }
  
    active.style.width = `${w + step}%`;
  }, (time * 1000 * step) / 100);
}
