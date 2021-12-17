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
};

export default PageLeftComponent;
