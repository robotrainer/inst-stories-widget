import { Overlay } from "./overlay.js";

export class Image extends Overlay {
  /**
   * Путь к изображенияю
   * @type {string}
   */
  src;

  /**
   * Алетернативнй текст изображения
   * @type {string}
   */
  alt = "";

  /**
   * @override
   * @param {{
   * type: string,
   * src: string,
   * alt?: string,
   * classes?: string[],
   * styles?: Object<string, string | string[]>
   * }=} [params] - параметры наложения
   *
   * 1. src - Путь к изображенияю
   * 2. [alt] - Алетернативнй текст изображения
   * */
  constructor(params) {
    super(params);
    this.src = params?.src;

    if (typeof this.src !== "string") {
      throw new ReferenceError(
        "URL to the created image overlay is not specified"
      );
    }

    this.alt = params?.alt ?? this.alt;
  }

  /** @override */
  render() {
    const element = super.render();

    element.innerHTML = `<img src="${this.src}" alt="${this.alt}">`;

    return element;
  }
}
