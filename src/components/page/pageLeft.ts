import BaseComponent from './base/base';

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

export default PageLeftComponent;
