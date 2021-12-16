/// <reference types="webpack/module" />

import '../style/css/style.css';

const err = (msg: string) => {
  throw msg;
};
const el = <T extends keyof HTMLElementTagNameMap>(v: T) => document.createElement(v);
const PAGEDVIDED: number = 10;
const LIMIT = 30;
interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
}
interface Composable {
  addChild(child: Component): void;
}
interface SectionContainer extends Component, Composable {
  addItems(item: ItemComponent): void;
  getItems(): ItemComponent[];
  reset(): void;
}

type Infos = {
  readonly urlArr: string[];
  readonly imgPerPage: number;
};
// if (module.hot) {
//
//   // module.hot.accept("./result", async () => {
//   //   // 감지하고자 하는 모듈을 첫번째 인자로 등록
//   //
//   //   resultEl.innerHTML = await result.render();
//   // });
// }

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

const PageComponent = class extends BaseComponent<HTMLElement> implements Composable {
  constructor() {
    super(`<div class="page-container"></div>`);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
};

const PageLeftComponent = class extends BaseComponent<HTMLElement> implements SectionContainer {
  private imgArr: Set<ItemComponent> = new Set();
  constructor() {
    super(`<div class="page-left"></div>`);
  }
  addItems(item: ItemComponent) {
    this.imgArr.add(item);
  }
  getItems(): ItemComponent[] {
    return Array.from(this.imgArr);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
  reset() {
    this.el.innerHTML = '';
  }
};
const PageRightComponent = class extends BaseComponent<HTMLElement> implements SectionContainer {
  private imgArr: Set<ItemComponent> = new Set();
  constructor() {
    super(`<div class="page-right"></div>`);
  }
  addItems(item: ItemComponent) {
    this.imgArr.add(item);
  }
  getItems(): ItemComponent[] {
    return Array.from(this.imgArr);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
  reset() {
    this.el.innerHTML = '';
  }
};
interface Dialog {
  get infos(): Infos;
  get renderBtn(): HTMLElement;
  add: () => void;
  close: () => void;
}
interface Pagination {
  new ({ totalImg, imgPerPage }: StateParams): Pagination;
  setState(newState: StateParams): void;
  getState(): GetState;
}
const DialogComponent = class extends BaseComponent<HTMLElement> implements Dialog {
  private urlArr: string[] = [];
  private imgPerPage: number = 4;
  // private sort: string = 'C';
  // private line: string = 'On';

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
            <label for="img-upload" class="btn btn-image" ><i class="far fa-images"></i></label>
            <button class="btn btn-remove btn-removeAll"><i class="far fa-trash-alt"></i></button>
          </div>
          <input type="file" id="img-upload" class="upload-hidden" multiple ></input>
          <ul class="urlLists"></ul>
        </div>
        <div class="dialog-options">
          <h1 class="option-title">OPTIONS</h1>
          <p>Img / Page</p>
          <select class="imgPerCnt">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option selected>4</option>
          <option>5</option>
          <option>6</option>
          </select>
  
          <p>Sort</p>
          <div class="sort-btns">
            <span class="btn btn-left">L</span>
            <span class="btn btn-center">C</span>
            <span class="btn btn-right">R</span>
          </div>
          <p>Line</p>
          <div class="line-btns">
            <span class="btn btn-on">On</span>
            <span class="btn btn-off">Off</span>
          </div>
        </div>
        <div class="dialog-start">
          <button class="btn-play"><i class="fas fa-play"></i></button>
        </div>
      </div>
    </aside>
`);

    const urlLists = this.el.querySelector('.urlLists') as HTMLUListElement;
    this.el.querySelector('.btn-removeAll')?.addEventListener('click', () => {
      urlLists.innerHTML = '';
      this.urlArr = [];
    });

    const uploadBtn = this.el.querySelector('.btn-image');
    uploadBtn?.addEventListener('click', () => {
      const fileInput = this.el.querySelector('#img-upload') as HTMLInputElement;
      fileInput.onchange = async (e: Event) => {
        urlLists.innerHTML = '';
        const target = e.target as HTMLInputElement;
        const fileList = target.files as FileList;
        const fileListArr = [...Object.values(fileList)];
        if (!fileListArr.length) err('invalid file length');

        for (let file of fileListArr) {
          const li = urlLists.appendChild(el('li'));
          if (li) {
            li.innerHTML = `
            <div>${file.name}</div>
            <button class="btn btn-remove"><i class="far fa-trash-alt"></i></button>
            `;
            li.classList.add('list');
            li.querySelector('.btn-remove')?.addEventListener('click', async () => {
              urlLists.removeChild(li);
              fileListArr.splice(fileListArr.indexOf(file), 1);
              this.urlArr = await this.convertFileToString(fileListArr);
            });
          }
        }
        this.urlArr = await this.convertFileToString(fileListArr);
        this.validate();
      };
    });
    const input = this.el.querySelector('.imgPerCnt') as HTMLInputElement;
    input.onchange = () => {
      this.validate();
      this.imgPerPage = Number(input.value);
    };
  }

  get infos(): Infos {
    const infos = {
      urlArr: this.urlArr,
      imgPerPage: this.imgPerPage,
    };
    return infos;
  }
  get renderBtn(): HTMLElement {
    return this.el.querySelector('.btn-play') as HTMLButtonElement;
  }
  add() {
    document.body.classList.toggle('dialog--active');
  }
  close() {
    document.body.classList.toggle('dialog--active');
  }
  private convertFileToString(imgUrls: File[]) {
    return Promise.all(imgUrls.map((url) => this.readAsDataUrl(url)));
  }
  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') res(fileReader.result);
      };
      fileReader.onerror = () => {
        rej(fileReader);
      };
      fileReader.readAsDataURL(file);
    });
  }
  private validate() {
    if (this.urlArr.length > this.imgPerPage * LIMIT) {
      alert(`이미지 개수가 ${this.urlArr.length - this.imgPerPage * LIMIT}개 초과합니다.`);
    }
  }
};
type StateParams = {
  currentPage?: number;
  totalImg?: number;
  imgPerPage?: number;
};
type GetState = Required<StateParams>;

class Pagination {
  private static base = new Pagination(1, 0, 6);
  static new({ totalImg, imgPerPage }: StateParams = {}) {
    const {
      currentPage: baseCurrent,
      totalImg: baseTotalImg,
      imgPerPage: baseImgPerPage,
    } = Pagination.base;
    return new Pagination(
      baseCurrent,
      totalImg !== undefined ? totalImg : baseTotalImg,
      imgPerPage !== undefined ? imgPerPage : baseImgPerPage,
    );
  }
  private constructor(
    private currentPage: number,
    private totalImg: number,
    private imgPerPage: number,
  ) {}

  setState(newState: StateParams) {
    this.currentPage = newState.currentPage ? newState.currentPage : this.currentPage;
  }
  getState(): GetState {
    return { currentPage: this.currentPage, totalImg: this.totalImg, imgPerPage: this.imgPerPage };
  }
}

interface BtnComponent {
  toggle(): void;
  get state(): BtnComponentState;
}
type BtnComponentState = {
  isActivated: boolean;
};

interface ItemComponent extends Component {
  move(state: boolean): void;
}
const ImageComponent = class extends BaseComponent<HTMLImageElement> implements ItemComponent {
  constructor(imgUrl: string) {
    super(`
        <img class="image__thumbnail">
    `);

    const imgEl = this.el as HTMLImageElement;
    imgEl.src = imgUrl;
  }
  move(state: boolean) {
    console.log('움직임등록!');
    if (this.checkState(state)) {
      this.el.classList.add('moving');
    } else {
      this.el.classList.remove('moving');
    }
  }
  private checkState(state: boolean): boolean {
    return state === true;
  }
};

const ZoomBtnComponent = class implements BtnComponent {
  private el = document.querySelector('.btn-zoom') as HTMLButtonElement;
  private isActivated: boolean = false;
  toggle() {
    this.isActivated = !this.isActivated;
    this.el.classList.toggle('activated');
  }
  get state(): BtnComponentState {
    return { isActivated: this.isActivated };
  }
};
const SizeBtnComponent = class implements BtnComponent {
  private el = document.querySelector('.btn-size') as HTMLButtonElement;
  private isActivated: boolean = false;
  toggle() {
    this.isActivated = !this.isActivated;
    this.el.classList.toggle('activated');
  }
  get state(): BtnComponentState {
    return { isActivated: this.isActivated };
  }
};
const MoveBtnComponent = class implements BtnComponent {
  private el = document.querySelector('.btn-move') as HTMLButtonElement;
  private isActivated: boolean = false;
  toggle() {
    this.isActivated = !this.isActivated;
    this.el.classList.toggle('activated');
  }
  get state(): BtnComponentState {
    return { isActivated: this.isActivated };
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
type AddImage = {
  cnt: number;
  image: ItemComponent;
  imgPerPage: number;
};
const DomRenderer = class extends Renderer {
  private dialog: Dialog & Component;
  private paginationContainer: HTMLDivElement;
  private pagination: Pagination = Pagination.new();
  private urlStrSaveArr: string[] = [];
  private pageLeft: SectionContainer = new PageLeftComponent();
  private pageRight: SectionContainer = new PageRightComponent();
  private moveComponent: BtnComponent = new MoveBtnComponent();
  private sizeComponent: BtnComponent = new SizeBtnComponent();
  private zoomComponent: BtnComponent = new ZoomBtnComponent();
  private moveBtn: HTMLButtonElement = document.querySelector('.btn-move') as HTMLButtonElement;
  private sizeBtn: HTMLButtonElement = document.querySelector('.btn-size') as HTMLButtonElement;
  private zoomBtn: HTMLButtonElement = document.querySelector('.btn-zoom') as HTMLButtonElement;

  constructor(private main: HTMLElement) {
    super();
    this.paginationContainer = document.querySelector('.pagination-container') as HTMLDivElement;
    const page = new PageComponent();
    page.attachTo(this.main);
    this.dialog = new DialogComponent();
    this.dialog.attachTo(document.body);
    [this.pageLeft, this.pageRight].forEach((v) => (page.addChild(v), v));
    const menuBtn = document.querySelector('.btn-bar');
    menuBtn?.addEventListener('click', () => {
      this.dialog.add();
      const closeBtn = document.querySelector('.btn-close');
      if (closeBtn instanceof HTMLButtonElement) {
        closeBtn.onclick = () => this.dialog.close();
      }
    });
    const renderBtn = this.dialog.renderBtn;
    renderBtn.addEventListener('click', () => {
      const {
        urlArr: { length },
        imgPerPage,
      } = this.dialog.infos;
      if (!length) return;
      if (length > imgPerPage * LIMIT) {
        alert(`이미지 개수가 ${length - imgPerPage * LIMIT}개 초과합니다.`);
        return;
      }
      this.pagination = Pagination.new({ totalImg: length, imgPerPage });
      this.urlStrSaveArr = [];
      this.render();
    });
  }
  override _render() {
    this.pageReset();
    const { currentPage, totalImg, imgPerPage } = this.pagination.getState();
    const fisrtPage = Math.floor((currentPage - 1) / PAGEDVIDED) * PAGEDVIDED + 1;
    const lastPage = fisrtPage + PAGEDVIDED - 1;
    const totalPageCount = Math.ceil(totalImg / (imgPerPage * 2));
    const children = Array.from({ length: totalPageCount }, () => el('span'));
    children[currentPage - 1]?.classList.add('current-page');
    const string: string = children
      .map((span, i) => ((span.innerHTML = String(i + 1)), span.outerHTML))
      .slice(fisrtPage - 1, lastPage)
      .join('');
    const html =
      (currentPage > 1 ? `<button class="prev-page"></button>` : '') +
      string +
      (children.length !== currentPage ? `<button class="next-page"></button>` : '');
    this.paginationContainer.innerHTML = html;

    const { urlArr } = this.dialog.infos;
    const showImgCnt = imgPerPage * 2;
    const startIdx = (currentPage - 1) * showImgCnt;
    urlArr.slice(startIdx, startIdx + showImgCnt).forEach((urlStr, cnt) => {
      let image;
      if (this.urlStrSaveArr.includes(urlStr)) {
        const savedImageArr = [this.pageLeft.getItems(), this.pageRight.getItems()].flat(1);
        savedImageArr.slice(startIdx, startIdx + showImgCnt).forEach((img, cnt) => {
          image = img;
          this.addImage({ cnt, image, imgPerPage });
        });
        return;
      } else {
        this.urlStrSaveArr.push(urlStr);
        image = new ImageComponent(urlStr);
      }
      this.addImage({ cnt, image, imgPerPage });
    });
    const nextPage = this.paginationContainer.querySelector('.next-page') as HTMLButtonElement;
    if (nextPage) {
      nextPage.onclick = () => {
        this.pagination.setState({ currentPage: currentPage + 1 });
        this.render();
      };
    }
    const prevPage = this.paginationContainer.querySelector('.prev-page') as HTMLButtonElement;
    if (prevPage) {
      prevPage.onclick = () => {
        this.pagination.setState({ currentPage: currentPage - 1 });
        this.render();
      };
    }
    this.paginationContainer.onclick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (currentPage === +target.innerHTML) return;
      if (target.tagName === 'SPAN') {
        this.pagination.setState({ currentPage: +target.innerHTML });
        this.render();
      }
    };
    this.moveBtn.onclick = () => {
      this.moveComponent.toggle();
      [this.pageLeft.getItems(), this.pageRight.getItems()]
        .flat(1)
        .forEach((img) => img.move(this.moveComponent.state.isActivated));
    };
    this.sizeBtn.onclick = () => {
      this.sizeComponent.toggle();
    };
    this.zoomBtn.onclick = () => {
      this.zoomComponent.toggle();
    };
  }
  private addImage({ cnt, image, imgPerPage }: AddImage) {
    if (cnt >= imgPerPage) {
      this.pageRight.addItems(image);
      this.pageRight.addChild(image);
    } else {
      this.pageLeft.addItems(image);
      this.pageLeft.addChild(image);
    }
  }
  private pageReset() {
    this.pageLeft.reset();
    this.pageRight.reset();
  }
};

new DomRenderer(document.querySelector('.main') as HTMLElement);
