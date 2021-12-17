// <reference types="webpack/module" />
// if (module.hot) {
//
//   // module.hot.accept("./result", async () => {
//   //   // 감지하고자 하는 모듈을 첫번째 인자로 등록
//   //
//   //   resultEl.innerHTML = await result.render();
//   // });
// }

import '../style/css/style.css';
import PageComponent from './components/page/page';
import PageLeftComponent from './components/page/pageLeft';
import PageRightComponent from './components/page/pageRight';
import DialogComponent from './components/page/dialog/dialog';
import MoveBtnComponent from './components/buttons/type/move';
import SizeBtnComponent from './components/buttons/type/size';
import ZoomBtnComponent from './components/buttons/type/zoom';
import ImageComponent from './components/page/image/img';
import Pagination from './components/pagination/pagination';
import { PAGEDVIDED, LIMIT } from './common/constant';
import { err, el } from './custom/funtions';

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
  private pagination: Pagination = Pagination.new();
  private urlStrSaveArr: string[] = [];
  private dialog = new DialogComponent();
  private page: PageContainer = new PageComponent();
  private pageLeft: SectionContainer = new PageLeftComponent();
  private pageRight: SectionContainer = new PageRightComponent();
  private moveComponent: BtnComponent = new MoveBtnComponent();
  private sizeComponent: BtnComponent = new SizeBtnComponent();
  private zoomComponent: BtnComponent = new ZoomBtnComponent();
  private moveBtn = document.querySelector('.btn-move') as HTMLButtonElement;
  private sizeBtn = document.querySelector('.btn-size') as HTMLButtonElement;
  private zoomBtn = document.querySelector('.btn-zoom') as HTMLButtonElement;
  private paginationContainer = document.querySelector('.pagination-container') as HTMLDivElement;

  constructor(private main: HTMLElement) {
    super();
    this.page.attachTo(this.main);
    this.dialog.attachTo(document.body);
    [this.pageLeft, this.pageRight].forEach((v) => this.page.addChild(v));
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
      this.page.imgArrClear();

      this.moveComponent.reset();
      this.sizeComponent.reset();
      this.zoomComponent.reset();
      this.render();
    });
  }
  override _render() {
    this.pageLeftRightReset();
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
        this.page
          .getItems()
          .slice(startIdx, startIdx + showImgCnt)
          .forEach((img, cnt) => {
            image = img;
            if (cnt >= imgPerPage) {
              this.pageRight.addChild(image);
            } else {
              this.pageLeft.addChild(image);
            }
          });
        return;
      } else {
        this.urlStrSaveArr.push(urlStr);
        image = new ImageComponent(urlStr);
      }
      if (cnt >= imgPerPage) {
        this.page.addItems(image);
        this.pageRight.addChild(image);
      } else {
        this.page.addItems(image);
        this.pageLeft.addChild(image);
      }
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
      this.moveComponent.toggle(this.sizeComponent, this.zoomComponent);
      this.btnReset();
    };
    this.sizeBtn.onclick = () => {
      this.sizeComponent.toggle(this.moveComponent, this.zoomComponent);
      this.btnReset();
    };
    this.zoomBtn.onclick = () => {
      this.zoomComponent.toggle(this.sizeComponent, this.moveComponent);
      this.btnReset();
    };
  }

  private pageLeftRightReset() {
    this.pageLeft.reset();
    this.pageRight.reset();
  }
  private btnReset() {
    this.page.getItems().forEach((img) => img.move(this.moveComponent.state.isActivated));
  }
};

new DomRenderer(document.querySelector('.main') as HTMLElement);
