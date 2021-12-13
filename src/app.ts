/// <reference types="webpack/module" />
console.log(import.meta.webpack);
import '../style/css/style.css';

const err = (msg: string) => {
  throw msg;
};
const el = <T extends keyof HTMLElementTagNameMap>(v: T) => document.createElement(v);

interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
}
if (module.hot) {
  console.log('핫모듈!');
  // module.hot.accept("./result", async () => {
  //   // 감지하고자 하는 모듈을 첫번째 인자로 등록
  //   console.log("result 모듈 변경됨");
  //   resultEl.innerHTML = await result.render();
  // });
}

const BaseComponent = class<T extends HTMLElement> implements Component {
  protected readonly el: T;
  constructor(html: string) {
    const template = el('template');
    template.innerHTML = html;
    this.el = template.content.firstElementChild as T;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = 'beforeend') {
    parent.insertAdjacentElement(position, this.el);
  }
  removeFrom(parent: HTMLElement) {
    parent.removeChild(this.el);
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
const DialogComponent = class extends BaseComponent<HTMLElement> {
  constructor() {
    super(`
    <aside class="dialog">
      <div class="dialog-top">
        <span class="title">Export |</span>
        <div class="top-buttons">
          <button class="btn btn-export"><i class="fas fa-file-pdf"></i></button>
          <button class="btn btn-close"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="container">
        <div class="dialog-fileloader">
          <div class="fileloader-buttons">
            <button class="btn btn-image"><i class="far fa-images"></i></button>
            <button class="btn btn-remove btn-removeAll"><i class="far fa-trash-alt"></i></button>
          </div>
          <div class="contents"></div>
        </div>
        <div class="dialog-options">
          <h1 class="option-title">OPTIONS</h1>
          <p>Img / Page</p>
          <div class="select-option">
            <input type="text" list="imgCnt" placeholder="6" />
            <datalist id="imgCnt">
              <option value="1">Max: 15장</option>
              <option value="2">Max: 30장</option>
              <option value="3">Max: 45장</option>
              <option value="4">Max: 60장</option>
              <option value="5">Max: 75장</option>
              <option value="6">Max: 90장</option>
            </datalist>
          </div>
          <p>Sort</p>
          <div class="sort-btns">
            <span class="left">L</span>
            <span class="center">C</span>
            <span class="right">R</span>
          </div>
          <p>Line</p>
          <div class="line-btns">
            <span class="on">On</span>
            <span class="off">Off</span>
          </div>
        </div>
        <div class="dialog-start">
          <button class="btn-play"><i class="fas fa-play"></i></button>
        </div>
      </div>
    </aside>
`);
  }

  add() {
    document.body.classList.toggle('dialog--active');
  }
  close() {
    document.body.classList.toggle('dialog--active');
  }
};
const Renderer = class {
  constructor() {}
  render() {
    this._render();
  }
  _render() {
    err('must be overrided!');
  }
};

const DomRenderer = class extends Renderer {
  constructor(private parent: HTMLElement) {
    super();
    const page = new PageComponent();
    page.attachTo(this.parent);
    const dialog = new DialogComponent();
    dialog.attachTo(document.body);
    [new PageLeftComponent(), new PageRightComponent()].forEach((v) => page.addChild(v));
    const menuBtn = document.querySelector('.btn-bar');

    menuBtn?.addEventListener('click', () => {
      dialog.add();
      const closeBtn = document.querySelector('.btn-close');
      if (closeBtn instanceof HTMLButtonElement) {
        closeBtn.onclick = () => dialog.close();
      }
    });
  }
  override _render() {}
};

new DomRenderer(document.querySelector('.main') as HTMLElement);
