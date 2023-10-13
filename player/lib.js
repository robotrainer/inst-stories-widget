import ClassSwitcher from "./class-switcher.js";

import { Overlay } from "./overlays/overlay.js";
import * as overlays from "./overlays/index.js";

/**
 * @typedef {{url: string, alt?: string, overlays?: Overlay[]}}
 */
const Slide = null;

/**
 * @typedef {Slide[]}
 */
const Slides = null;

export default class Player {
  /**
   * Контейнер для плеера
   * @type {Element}
   */
  target;

  /**
   * Cписок слайдов плеера
   * @type {Slides}
   */
  slides;

  /**
   * Время длительности слайда
   * @type {number}
   */
  delayPerSlide = 3;

  /**
   * Экземпляр ClassSwitcher
   * @protected
   */
  cs;

  /**
   * Создаёт объект плеер
   *
   * @param {{
   * target: string,
   * slides: Slides,
   * delayPerSlide?: number,
   * }} params
   * Параметры инициализации:
   * 1. target - место инициализации плеера, CSS-селектор
   * 2. slides - список слайдов плеера
   * 3. delayPerSlide - как долго показывается один слайд
   */
  constructor(params) {
    this.target = document.querySelector(params?.target);

    if (this.target === null) {
      throw new ReferenceError("A target to mount the player is not specified");
    }

    this.slides = params?.slides;

    if (!Array.isArray(this.slides)) {
      throw new TypeErrorError("Slides to render is not specifide");
    }

    this.delayPerSlide = params?.delayPerSlide ?? this.delayPerSlide;

    this.cs = new ClassSwitcher(this.target);

    this.mount();
  }

  /**
   * Монтирует элементы плеера в target
   */
  mount() {
    this.target.appendChild(this.generatrPlayerLayout());

    this.target
      .querySelector(".player-chunk-prev")
      .addEventListener("click", this.cs.switchToPrevChunk.bind(this.cs));
    this.target
      .querySelector(".player-chunk-next")
      .addEventListener("click", this.cs.switchToNextChunk.bind(this.cs));

    this.cs.runChunkSwitching(this.delayPerSlide, 1);
  }

  /**
   * Генерирует элементы временной шкалы
   * @returns {DocumentFragment}
   */
  generateTimelineChunks() {
    const wrapper = document.createDocumentFragment();

    for (const index of this.slides.keys()) {
      const element = document.createElement("div");

      // TODO переписать на insertAdjacentHTML
      element.innerHTML = ` <div
        class="timeline-chunk ${index === 0 ? "timeline-chunk-active" : ""}"
      >
        <div class="timeline-chunk-inner"></div>
      </div>`;

      wrapper.appendChild(element.children[0]);
    }

    return wrapper;
  }

  /**
   * Генерируент элементы слайдов
   * @returns {DocumentFragment}
   */
  generatePlayerChunks() {
    const wrapper = document.createDocumentFragment();

    for (const [index, slide] of this.slides.entries()) {
      const element = document.createElement("div");

      const style = [];

      if (slide.filter) {
        style.push(`filter: ${slide.filter.join(" ")}`);
      }

      element.innerHTML = ` <div
        class="player-chunk ${index === 0 ? "player-chunk-active" : ""}"
      >
        <img
          src="${slide.url}"
          alt="${slide.alt ?? ""}"
          style="${style.join(";")}"
        />
      </div>`;

      const chunk = element.children[0];

      chunk.appendChild(this.generateOverlayes(slide));

      wrapper.appendChild(chunk);
    }

    return wrapper;
  }

  /**
   *  Генерирует элементы наложения на слайд
   * @param {Slide} slide - объект слайда
   * @returns {DocumentFragment}
   */
  generateOverlayes(slide) {
    const wrapper = document.createDocumentFragment();

    if (slide.overlays == null) {
      return wrapper;
    }

    for (const params of slide.overlays) {
      if (!(params.type in overlays)) {
        throw new TypeError(
          `The specifide type of overlay (${params.type}) is not defined`
        );
      }

      const overlay = new overlays[params.type](params);
      wrapper.appendChild(overlay.render());
    }

    return wrapper;
  }

  /**
   * Генерирует элементы плеера
   * @returns {Element}
   */
  generatrPlayerLayout() {
    const timeline = document.createElement("div");

    timeline.setAttribute("class", "timeline");
    timeline.appendChild(this.generateTimelineChunks());

    const content = document.createElement("div");

    content.setAttribute("class", "player-content");
    content.appendChild(this.generatePlayerChunks());

    const contentWrapper = document.createElement("div");

    contentWrapper.setAttribute("class", "player-content-wrapper");
    contentWrapper.innerHTML = `<div
        class="player-chunk-switcheer player-chunk-prev"
      ></div>
      <div class="player-chunk-switcheer player-chunk-next"></div>`;
    contentWrapper.appendChild(content);

    const player = document.createElement("div");

    player.setAttribute("class", "player");
    player.appendChild(timeline);
    player.appendChild(contentWrapper);

    return player;
  }
}
