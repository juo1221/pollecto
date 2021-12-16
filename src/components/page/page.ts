import BaseComponent from './base/base';

const PageComponent = class extends BaseComponent<HTMLElement> implements Composable {
  constructor() {
    super(`<div class="page-container"></div>`);
  }
  addChild(child: Component) {
    child.attachTo(this.el);
  }
};

export default PageComponent;
