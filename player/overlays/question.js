import { Overlay } from "./overlay.js";

export class Question extends Overlay {
  /**
   * Текст вопроса
   * @type {string}
   */
  question;

  /**
   * Варианты ответа
   * @type {string[]}
   */
  variants = ["Да", "Нет"];

  /**
   * @override
   * @param {{
   * type: string,
   * question: string,
   * variants?: string[],
   * classes?: string[],
   * styles?: Object<string, string | string[]>
   * }=} [params] - параметры наложения
   *
   * 1. question - Текст вопроса
   * 2. variants - Варианты ответа
   * */
  constructor(params) {
    super(params);
    this.question = params?.question;

    if (typeof this.question !== "string") {
      throw new ReferenceError(
        "A question text to the created overlay is not specified"
      );
    }

    this.variants = params?.variants ?? this.variants;

    if (this.variants.length === 0) {
      throw new Error("There must be at least one answer option.");
    }
  }

  /** @override */
  render() {
    const element = super.render();

    element.innerHTML = `
    <div class="question">
      ${this.question}
      <div class="question-answers">
        ${this.variants
          .map((label, index) => `<button value="${index}">${label}</button>`)
          .join("")}
      </div>
    </div>`;

    element.querySelector(".question-answers").addEventListener("click", (event) => {
      if (event.target.tagName !== "BUTTON") {
        return;
      }

      alert(event.target.value);
    });

    return element;
  }
}
