import BaseComponent from './base/base';
import { err } from '@Custom/funtions';

const PageComponent = class extends BaseComponent<HTMLElement> implements PageContainer {
  private imgMap: Map<number, Set<ImgComponent>> = new Map();
  constructor() {
    super(`<div class="page-container"></div>`);
  }
  setImg(currentPage: number, img: ImgComponent) {
    if (!this.imgMap.has(currentPage)) {
      this.imgMap.set(currentPage, new Set([img]));
    } else {
      this.imgMap.set(currentPage, this.imgMap.get(currentPage)?.add(img) as Set<ImgComponent>);
    }
  }
  getImg(currentPage: number): Set<ImgComponent> {
    console.log(this.imgMap);
    if (!this.imgMap.has(currentPage)) {
      return err('저장된 이미지가 없습니다.');
    } else {
      return this.imgMap.get(currentPage) as Set<ImgComponent>;
    }
  }
  getAllImg(): ImgComponent[][] {
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
};

export default PageComponent;
