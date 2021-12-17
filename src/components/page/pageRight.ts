import BaseComponent from './base/base';

const PageRightComponent = class extends BaseComponent<HTMLElement> implements SectionContainer {
  constructor() {
    super(`<div class="page-right"></div>`);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
  reset() {
    this.el.innerHTML = '';
  }
};
export default PageRightComponent;
