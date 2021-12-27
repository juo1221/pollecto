// <reference types="webpack/module" />
// if (module.hot) {
//
//   // module.hot.accept("./result", async () => {
//   //   // 감지하고자 하는 모듈을 첫번째 인자로 등록
//   //
//   //   resultEl.innerHTML = await result.render();
//   // });
// }
import * as html2pdf from 'html2pdf.js';
import './style/css/style.css';
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
import { PageContainer, SectionContainer, Button, SetAndAddImage } from '@Custom/types';

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
  private moveComponent: Button = new MoveBtnComponent();
  private sizeComponent: Button = new SizeBtnComponent();
  private zoomComponent: Button = new ZoomBtnComponent();
  private moveBtn = document.querySelector('.btn-move') as HTMLButtonElement;
  private sizeBtn = document.querySelector('.btn-size') as HTMLButtonElement;
  private zoomBtn = document.querySelector('.btn-zoom') as HTMLButtonElement;
  private paginationContainer = document.querySelector('.pagination-container') as HTMLDivElement;

  constructor(private main: HTMLElement) {
    super();
    this.page.attachTo(this.main);
    this.dialog.attachTo(document.body);
    [this.pageLeft, this.pageRight].forEach((v) => this.page.addChild(v));

    const closeBtn = document.querySelector('.btn-close');
    if (closeBtn instanceof HTMLButtonElement) {
      closeBtn.onclick = () => this.dialog.close();
    }
    const menuBtn = document.querySelector('.btn-bar');
    menuBtn?.addEventListener('click', () => this.dialog.add());

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
      [this.moveComponent, this.sizeComponent, this.zoomComponent].forEach((component) => component.reset());
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
        Array.from(this.page.getImg(currentPage)).forEach((img, cnt) => {
          image = img;
          this.setAndAddImage({ cnt, imgPerPage, currentPage, image });
        });
        return;
      } else {
        this.urlStrSaveArr.push(urlStr);
        image = new ImageComponent(urlStr);
      }
      this.setAndAddImage({ cnt, imgPerPage, currentPage, image });
    });
    const nextPage = this.paginationContainer.querySelector('.next-page') as HTMLButtonElement;
    if (nextPage) {
      nextPage.onclick = () => {
        this.pagination.setState({ currentPage: currentPage + 1 });
        this.render();
        this.checkAllOfClass();
      };
    }
    const prevPage = this.paginationContainer.querySelector('.prev-page') as HTMLButtonElement;
    if (prevPage) {
      prevPage.onclick = () => {
        this.pagination.setState({ currentPage: currentPage - 1 });
        this.render();
        this.checkAllOfClass();
      };
    }
    this.paginationContainer.onclick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (currentPage === +target.innerHTML) return;
      if (target.tagName === 'SPAN') {
        this.pagination.setState({ currentPage: +target.innerHTML });
        this.render();
        this.checkAllOfClass();
      }
    };
    this.moveBtn.onclick = () => {
      this.moveComponent.toggleAndRemove(this.sizeComponent);
      this.checkAllOfClassAndAddMoveEvent();
    };
    this.sizeBtn.onclick = () => {
      this.sizeComponent.toggleAndRemove(this.moveComponent);
      this.checkAllOfClassAndAddSizeEvent();
    };
    this.zoomBtn.onclick = () => {
      this.zoomComponent.toggleAndRemove();
      this.zoomComponent.state.isActivated ? this.startZoom() : this.endZoom();
    };

    const pdfBtn = this.dialog.pdfBtn;
    pdfBtn.onclick = async () => {
      const element = document.querySelector('#element') as HTMLUListElement;
      const loader = document.querySelector('.loader-container') as HTMLElement;

      loader.style.visibility = 'visible';
      element.style.display = 'block';
      element.innerHTML = '';

      setTimeout(() => {
        for (let i = 0; i < totalPageCount; i++) {
          const imgArr = [this.pageLeft.getChildren(), this.pageRight.getChildren()];
          imgArr.forEach((item) => {
            if (item) {
              const cloneItem = item.cloneNode(true);
              element?.appendChild(cloneItem);
              const divEl = element?.appendChild(el('div'));
              divEl?.appendChild(cloneItem);
            }
          });
          const nextBtn = document.querySelector('.next-page') as HTMLButtonElement;
          nextBtn?.click();
        }

        new html2pdf()
          .from(element)
          .set({
            filename: 'file.pdf',
            html2canvas: { scale: 2, logging: true, dpi: 200, letterRendering: true },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
          })
          .save()
          .then(() => {
            element.style.display = 'none';
            loader.style.visibility = 'hidden';
          });
      }, 0);
    };
  }

  private pageLeftRightReset() {
    this.pageLeft.reset();
    this.pageRight.reset();
  }
  private checkAllOfClass() {
    this.page
      .getAllImg()
      .flat(1)
      .forEach((img) => {
        img.addOrRemoveMovingClass(this.moveComponent.state.isActivated);
        img.addOrRemoveSizingClass(this.sizeComponent.state.isActivated);
        this.moveComponent.state.isActivated && img.move(this.moveComponent.state.isActivated);
        this.sizeComponent.state.isActivated && img.size(this.sizeComponent.state.isActivated);
      });
  }
  private checkAllOfClassAndAddMoveEvent() {
    this.page
      .getAllImg()
      .flat(1)
      .forEach((img) => {
        img.addOrRemoveMovingClass(this.moveComponent.state.isActivated);
        img.addOrRemoveSizingClass(this.sizeComponent.state.isActivated);

        img.move(this.moveComponent.state.isActivated);
      });
  }
  private checkAllOfClassAndAddSizeEvent() {
    this.page
      .getAllImg()
      .flat(1)
      .forEach((img) => {
        img.addOrRemoveMovingClass(this.moveComponent.state.isActivated);
        img.addOrRemoveSizingClass(this.sizeComponent.state.isActivated);

        img.size(this.sizeComponent.state.isActivated);
      });
  }
  private setAndAddImage({ cnt, imgPerPage, currentPage, image }: SetAndAddImage) {
    if (cnt >= imgPerPage) {
      this.page.setImg(currentPage, image);
      this.pageRight.addChild(image);
    } else {
      this.page.setImg(currentPage, image);
      this.pageLeft.addChild(image);
    }
  }
  private startZoom() {
    this.main.classList.add('zooming');
    this.main.onwheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.page.zoomIn();
      } else {
        this.page.zoomOut();
      }
    };
  }
  private endZoom() {
    this.main.classList.remove('zooming');
    this.main.onwheel = null;
  }
};

new DomRenderer(document.querySelector('.main') as HTMLElement);
