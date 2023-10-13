export default class ClassSwitcher {
  /**
   * Корневой элемент
   * @type {Element}
   */
  root;

  /**
   * Индификатор таймера
   * @type {number | undefined}
   */
  timelineTimer;

  /**
   * @param {Element} root - корневой элемент
   */
  constructor(root) {
    this.root = root;

    if (!(this.root instanceof Element)) {
      throw new TypeError("The root element is not defined");
    }
  }

  /**
   *
   * @param {string} className
   * @param {string} method
   * @param {function|undefined} pred
   *
   * @returns {Element|null}
   */
  moveClass(className, method, pred) {
    const elem = this.root.querySelector("." + className);
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

  switchToNextChunk() {
    this.moveClass("player-chunk-active", "nextElementSibling");
    const el = this.moveClass("timeline-chunk-active", "nextElementSibling");

    if (el) {
      el.querySelector(".timeline-chunk-inner").style.width = "";
    }
  }

  switchToPrevChunk() {
    const el = this.moveClass(
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
      this.moveClass("player-chunk-active", "previousElementSibling");
    }
  }

  /**
   *
   * @param {number|undefined} time
   * @param {number|undefined} step
   */
  runChunkSwitching(time = 2, step = 1) {
    clearInterval(this.timelineTimer);

    this.timelineTimer = setInterval(() => {
      const active = this.root
        .querySelector(".timeline-chunk-active")
        .querySelector(".timeline-chunk-inner");
      const w = parseFloat(active.style.width) || 0;

      if (w === 100) {
        this.switchToNextChunk();
        return;
      }

      active.style.width = `${w + step}%`;
    }, (time * 1000 * step) / 100);
  }
}
