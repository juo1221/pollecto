import BaseComponent from './base/base';
import { err } from '@Custom/funtions';

const PageComponent = class extends BaseComponent<HTMLElement> implements PageContainer {
  private imgMap: Map<number, Set<Image>> = new Map();
  constructor() {
    super(`<div class="page-container"></div>`);
  }
  setImg(currentPage: number, img: Image) {
    if (!this.imgMap.has(currentPage)) {
      this.imgMap.set(currentPage, new Set([img]));
    } else {
      this.imgMap.set(currentPage, this.imgMap.get(currentPage)?.add(img) as Set<Image>);
    }
  }
  getImg(currentPage: number): Set<Image> {
    if (!this.imgMap.has(currentPage)) {
      return err('저장된 이미지가 없습니다.');
    } else {
      return this.imgMap.get(currentPage) as Set<Image>;
    }
  }
  getAllImg(): Image[][] {
    const arr = [];
    for (let [_, v] of Array.from(this.imgMap)) {
      arr.push(Array.from(v));
    }
    return arr;
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
  imgArrClear() {
    this.imgMap.clear();
  }
  zoomIn(): void {
    this.el.style.transform = `scale(1.0)`;
  }
  zoomOut(): void {
    this.el.style.transform = `scale(0.7)`;
  }
};

export default PageComponent;
