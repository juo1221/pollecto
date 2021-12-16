const ButtonComponent = class implements BtnComponent {
  private el: HTMLButtonElement;
  private isActivated: boolean = false;
  constructor(className: string) {
    this.el = document.querySelector(className) as HTMLButtonElement;
  }
  toggle() {
    this.isActivated = !this.isActivated;
    this.el.classList.toggle('activated');
  }
  get state(): BtnComponentState {
    return { isActivated: this.isActivated };
  }
};
export default ButtonComponent;
