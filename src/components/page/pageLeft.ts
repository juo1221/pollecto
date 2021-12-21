import BaseComponent from './base/base';

const PageLeftComponent = class extends BaseComponent<HTMLElement> implements SectionContainer {
  constructor() {
    super(`<div class="page-left"></div>`);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
  reset() {
    this.el.innerHTML = '';
  }
  getChildren(): Element | null {
    if (this.el.children.length) return this.el;
    else return null;
  }
};

export default PageLeftComponent;
