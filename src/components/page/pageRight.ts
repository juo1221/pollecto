import BaseComponent from './base/base';

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
export default PageRightComponent;
