import ButtonComponent from '../button';

const SizeBtnComponent = class<T extends BtnComponent> extends ButtonComponent {
  constructor() {
    super('.btn-size');
  }
  override toggle(...btns: T[]) {
    this.resetState(btns);
    this.el.classList.toggle('activated');
    this.isActivated = !this.isActivated;
  }
  private resetState(btns: T[]) {
    btns.forEach((btn) => {
      if (btn.state.isActivated) btn.toggle();
    });
  }
};
export default SizeBtnComponent;
