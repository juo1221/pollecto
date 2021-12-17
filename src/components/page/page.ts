import BaseComponent from './base/base';

const PageComponent = class extends BaseComponent<HTMLElement> implements PageContainer {
  private imgArr: Set<ItemComponent> = new Set();
  constructor() {
    super(`<div class="page-container"></div>`);
  }
  addItems(item: ItemComponent) {
    this.imgArr.add(item);
  }
  getItems(): ItemComponent[] {
    console.log('left ', Array.from(this.imgArr));
    return Array.from(this.imgArr);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
};

export default PageComponent;
