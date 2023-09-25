/**
 * Инициализирует плеер Stories по заданным параметрам
 * @param {{target: string, 
 * slides: Array<{url: string, alt?: string}>, 
 * delayPerSlide?: number,
 * }} params
 * Параметры инициализации:
 * 1. target - место инициализации плеера, CSS-селектор
 * 2. slides - список слайдов плеера
 * 3. delayPerSlide - как долго показывается один слайд
 * 
 * @returns {Element|null}
 */

function initPlayer(params) {
  const target = document.querySelector(params.target);

  if (target === null || params.slides === undefined) {
    return null;
  }

  let timelineChunks = "";
  let playerChunks = "";

  let isFirst = true;

  for (const slide of params.slides) {
    timelineChunks += generateTimelineChunk(isFirst);
    playerChunks += generatePlayerChunk(slide, isFirst);
    isFirst = false;
  }

  target.innerHTML = generatrPlayerLayout();

  target
    .querySelector(".player-chunk-prev")
    .addEventListener("click", switchToPrevChunk);
  target
    .querySelector(".player-chunk-next")
    .addEventListener("click", switchToNextChunk);

  let timelineTimer;
  runChunkSwitching(params.delayPerSlide, 1);

  return target.querySelector(".player");

  function generateTimelineChunk(isFirst) {
    return `
    <div class="timeline-chunk ${isFirst ? "timeline-chunk-active" : ""}">
      <div class="timeline-chunk-inner"></div>
    </div>`;
  }

  function generatePlayerChunk(slide, isFirst) {
    return `
    <div class="player-chunk ${isFirst ? "player-chunk-active" : ""}">
      <img
        src="${slide.url}"
        alt="${slide.alt || ""}">
    </div>`;
  }

  function generatrPlayerLayout() {
    return `
    <div class="player">
      <div class="timeline">${timelineChunks}</div>
    
      <div class="player-content-wrapper">
        <div class="player-chunk-switcheer player-chunk-prev"></div>
        <div class="player-chunk-switcheer player-chunk-next"></div>
    
        <div class="player-content">${playerChunks}</div>
    
      </div>
    </div>`;
  }

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

  function switchToNextChunk() {
    moveClass("player-chunk-active", "nextElementSibling");
    const el = moveClass("timeline-chunk-active", "nextElementSibling");

    if (el) {
      el.querySelector(".timeline-chunk-inner").style.width = "";
    }
  }

  function switchToPrevChunk() {
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

  function runChunkSwitching(time = 2, step = 1) {
    clearInterval(timelineTimer);

    timelineTimer = setInterval(() => {
      const active = target
        .querySelector(".timeline-chunk-active")
        .querySelector(".timeline-chunk-inner");
      const w = parseFloat(active.style.width) || 0;

      if (w === 100) {
        switchToNextChunk();
        return;
      }

      active.style.width = `${w + step}%`;
    }, (time * 1000 * step) / 100);
  }
}
