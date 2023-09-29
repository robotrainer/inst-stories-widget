/**
 * Инициализирует плеер Stories по заданным параметрам
 * @param {{
 * target: string,
 * slides: Array<{url: string, alt?: string, overlays?: Array<{type: string, value: string, styles?: {}}>}>,
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

  /**
   *
   * @param {boolean} isFirst
   *
   * @returns {string}
   */
  function generateTimelineChunk(isFirst) {
    return `
    <div class="timeline-chunk ${isFirst ? "timeline-chunk-active" : ""}">
      <div class="timeline-chunk-inner"></div>
    </div>`;
  }

  /**
   *
   * @param {{
   * url: string,
   * alt?: string,
   * overlays?: Array<{type: string, value: string, styles?: {}}
   * }} slide
   * @param {boolean} isFirst
   *
   * @returns {string}
   */
  function generatePlayerChunk(slide, isFirst) {
    return `
    <div class="player-chunk ${isFirst ? "player-chunk-active" : ""}">
      <img
        src="${slide.url}"
        alt="${slide.alt || ""}">
        ${generateOverlayes(slide)}
    </div>`;
  }

  /**
   *
   * @param {{
   * url: string,
   * overlays?: Array<{type: string, value: string, classes?: Array<string> styles?: {}}>,
   * alt?: string
   * }} slide
   *
   * @returns {string}
   */
  function generateOverlayes(slide) {
    if (slide.overlays === undefined) {
      return "";
    }

    let overlayHTML = "";

    for (const overlay of slide.overlays) {
      const classes = overlay.classes !== undefined ? overlay.classes.join(" ") : "";

      const styles = (
        overlay.styles !== undefined ? Object.entries(overlay.styles) : []
      )
        .map((style) => style.join(":"))
        .join("; ");

      overlayHTML += `
      <div class="player-chunk-overlay ${classes}" style="${styles}">${renderOverlay(
        overlay
      )}</div>`;
    }

    return overlayHTML;

    /**
     *
     * @param {{type: string, value: string, styles?: {}}} overlay
     * @returns {string}
     */
    function renderOverlay(overlay) {
      if (overlay.type === "text") {
        return overlay.value;
      }

      if (overlay.type === "img") {
        return `<img src="${overlay.value}" alt="">`;
      }

      return "";
    }
  }

  /**
   *
   * @returns {string}
   */
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

  /**
   *
   * @param {string} className
   * @param {string} method
   * @param {function|undefined} pred
   *
   * @returns {Element|null}
   */
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

  /**
   *
   * @param {number|undefined} time
   * @param {number|undefined} step
   */
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
