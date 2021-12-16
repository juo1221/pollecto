import ButtonComponent from '../button';

const ZoomBtnComponent = class<T extends BtnComponent> extends ButtonComponent {
  constructor() {
    super('.btn-zoom');
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
export default ZoomBtnComponent;
