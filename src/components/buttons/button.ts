import { Button, BtnComponentState } from '@Custom/types';

const ButtonComponent = class implements Button {
  protected el: HTMLButtonElement;
  protected isActivated: boolean = false;
  constructor(className: string) {
    this.el = document.querySelector(className) as HTMLButtonElement;
  }
  get state(): BtnComponentState {
    return { isActivated: this.isActivated };
  }
  toggleAndRemove(...btns: Button[]) {
    this.resetState(btns);
    this.el.classList.toggle('activated');
    this.isActivated = !this.isActivated;
  }
  private resetState(btns: Button[]) {
    btns.forEach((btn) => {
      if (btn.state.isActivated) btn.reset();
    });
  }
  reset() {
    this.el.classList.remove('activated');
    this.isActivated = false;
  }
};
export default ButtonComponent;
