import { Component } from '@Custom/types';

import { el } from '@Custom/funtions';

const BaseComponent = class<T extends HTMLElement> implements Component {
  protected readonly el: T;
  constructor(html: string) {
    const template = el('template');
    template.innerHTML = html;
    this.el = template.content.firstElementChild as T;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = 'beforeend') {
    parent.insertAdjacentElement(position, this.el);
  }
  removeFrom(parent: HTMLElement) {
    parent.removeChild(this.el);
  }
};

export default BaseComponent;
