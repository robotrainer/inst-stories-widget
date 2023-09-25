function initPlayer(params) {
  const target = document.querySelector(params.target);

  if (target === null || params.slides === undefined) {
    return;
  }

  let timelineChunks = "";
  let playerChunks = "";

  let isFirst = true;

  for (const el of params.slides) {
    timelineChunks += `
<div class="timeline-chunk ${isFirst ? "timeline-chunk-active" : ""}">
  <div class="timeline-chunk-inner"></div>
</div>`;

    playerChunks = `
<div class="player-chunk ${isFirst ? "player-chunk-active" : ""}">
  <img
    src="${el.url}"
    alt="${el.alt || ""}">
</div>`;

    isFirst = false;
  }

  target.innerHTML = `
<div class="player">
  <div class="timeline">${timelineChunks}</div>

  <div class="player-content-wrapper">
    <div class="player-chunk-switcheer player-chunk-prev"></div>
    <div class="player-chunk-switcheer player-chunk-next"></div>

    <div class="player-content">${playerChunks}</div>

  </div>
</div>`;

  target.querySelector(".player-chunk-prev").addEventListener("click", prev);
  target.querySelector(".player-chunk-next").addEventListener("click", next);

  let timer;

  runInterval(params.delayPerSlide, 1);

  function moveClass(className, method, pred) {
    const elem = target.querySelector("." + className);
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
    const el = moveClass(
      "timeline-chunk-active",
      "previousElementSibling",
      (el) => {
        const inner = el.querySelector(".timeline-chunk-inner");
        const w = parseFloat(inner.style.width) || 0;

        inner.style.width = "";

        return w <= 20;
      }
    );

    if (el) {
      moveClass("player-chunk-active", "previousElementSibling");
    }
  }

  function runInterval(time = 2, step = 1) {
    clearInterval(timer);

    timer = setInterval(() => {
      const active = target
        .querySelector(".timeline-chunk-active")
        .querySelector(".timeline-chunk-inner");
      const w = parseFloat(active.style.width) || 0;

      if (w === 100) {
        next();
        return;
      }

      active.style.width = `${w + step}%`;
    }, time * 1000 * step / 100);
  }
}
