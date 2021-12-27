import BaseComponent from './base/base';
import { SectionContainer, Component } from '@Custom/types';

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
  getChildren(): Element | null {
    if (this.el.children.length) return this.el;
    else return null;
  }
};
export default PageRightComponent;
