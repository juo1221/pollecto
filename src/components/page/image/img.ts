import BaseComponent from '../base/base';

const ImageComponent = class extends BaseComponent<HTMLImageElement> implements ItemComponent {
  constructor(imgUrl: string) {
    super(`
          <img class="image__thumbnail">
      `);

    const imgEl = this.el as HTMLImageElement;
    imgEl.src = imgUrl;
  }
  move(state: boolean) {
    console.log('움직임등록!');
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
