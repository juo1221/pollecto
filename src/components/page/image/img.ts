import BaseComponent from '../base/base';

const ImageComponent = class extends BaseComponent<HTMLImageElement> implements Image {
  constructor(imgUrl: string) {
    super(`
          <img class="image__thumbnail">
      `);

    const imgEl = this.el as HTMLImageElement;
    imgEl.src = imgUrl;
  }
  move(state: boolean) {
    if (this.checkState(state)) {
      this.el.classList.add('moving');
    } else {
      this.el.classList.remove('moving');
    }
  }
  private checkState(state: boolean): boolean {
    return state === true;
  }
};
export default ImageComponent;
