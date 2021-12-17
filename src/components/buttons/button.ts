import { err } from '@Custom/funtions';

const ButtonComponent = class implements BtnComponent {
  protected el: HTMLButtonElement;
  protected isActivated: boolean = false;
  constructor(className: string) {
    this.el = document.querySelector(className) as HTMLButtonElement;
  }
  get state(): BtnComponentState {
    return { isActivated: this.isActivated };
  }
  toggle() {
    err('must be overrided!');
  }
};
export default ButtonComponent;
