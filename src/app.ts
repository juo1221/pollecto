/// <reference types="webpack/module" />
console.log(import.meta.webpack);
import "../style/css/style.css";

const err = (msg: string) => {
  throw msg;
};
const el = <T extends keyof HTMLElementTagNameMap>(v: T) =>
  document.createElement(v);

interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
}
if (module.hot) {
  console.log("핫모듈!");
  // module.hot.accept("./result", async () => {
  //   // 감지하고자 하는 모듈을 첫번째 인자로 등록
  //   console.log("result 모듈 변경됨");
  //   resultEl.innerHTML = await result.render();
  // });
}

const BaseComponent = class<T extends HTMLElement> implements Component {
  protected readonly el: T;
  constructor(html: string) {
    const template = el("template");
    template.innerHTML = html;
    this.el = template.content.firstElementChild as T;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.el);
  }
};

const PageComponent = class extends BaseComponent<HTMLElement> {
  constructor() {
    super(`<div class="page-container"></div>`);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
};
const PageLeftComponent = class extends BaseComponent<HTMLElement> {
  constructor() {
    super(`<div class="page-left"></div>`);
  }
};
const PageRightComponent = class extends BaseComponent<HTMLElement> {
  constructor() {
    super(`<div class="page-right"></div>`);
  }
};

const Renderer = class {
  constructor() {}
  render() {
    this._render();
  }
  _render() {
    err("must be overrided!");
  }
};

const DomRenderer = class extends Renderer {
  constructor(private parent: HTMLElement) {
    super();
    const page = new PageComponent();
    page.attachTo(this.parent);
    [new PageLeftComponent(), new PageRightComponent()].forEach((v) =>
      page.addChild(v)
    );
  }
  override _render() {}
};

new DomRenderer(document.querySelector(".main") as HTMLElement);
