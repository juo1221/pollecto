import BaseComponent from '../base/base';
import { err } from '@Custom/funtions';
const ImageComponent = class extends BaseComponent<HTMLImageElement> implements Image {
  constructor(imgUrl: string) {
    super(`
          <img class="image__thumbnail" >
      `);

    const imgEl = this.el as HTMLImageElement;
    imgEl.src = imgUrl;
  }
  addOrRemoveMovingClass(state: boolean) {
    if (this.checkState(state)) {
      this.el.classList.add('moving');
    } else {
      this.el.classList.remove('moving');
    }
  }
  move(state: boolean) {
    if (!this.checkState(state)) {
      this.el.removeEventListener('mousedown', this.addMouseEvent);
      return;
    }
    this.el.addEventListener('mousedown', this.addMouseEvent);
  }
  private addMouseEvent(e: MouseEvent): void {
    e.preventDefault();
    const target = e.target as HTMLImageElement;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const matrix = window.getComputedStyle(target).transform;
    const matrixStringArr = matrix.match(/matrix.*\((.+)\)/) as string[];
    if (!matrixStringArr[1]) err('maxtrix값이 없습니다!');

    const x = matrixStringArr[1]?.split(', ')[4];
    const y = matrixStringArr[1]?.split(', ')[5];

    const imagePositionLeft = Number(x) - clientX;
    let offsetX: number;
    const imagePostionTop = Number(y) - clientY;
    let offsetY: number;

    document.onmousemove = (e: MouseEvent) => {
      offsetX = imagePositionLeft + e.clientX;
      offsetY = imagePostionTop + e.clientY;
      target.style.transform = `translate(${offsetX}px,${offsetY}px )`;
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  private checkState(state: boolean): boolean {
    return state === true;
  }
};
export default ImageComponent;
