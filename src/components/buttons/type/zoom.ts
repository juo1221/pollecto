import ButtonComponent from '../button';

const ZoomBtnComponent = class extends ButtonComponent {
  constructor() {
    super('.btn-zoom');
  }

  override toggleAndRemove() {
    this.el.classList.toggle('activated');
    this.isActivated = !this.isActivated;
  }
};
export default ZoomBtnComponent;
