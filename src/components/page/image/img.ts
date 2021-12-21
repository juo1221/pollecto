import BaseComponent from '../base/base';
import { err } from '@Custom/funtions';
const ImageComponent = class extends BaseComponent<HTMLImageElement> implements Image {
  private handlers: Map<MethodName, any[]> = new Map();
  constructor(imgUrl: string) {
    super(`
        <div class="image-container">
          <img class="image__thumbnail" >
        </div>
      `);

    const imgEl = this.el.querySelector('.image__thumbnail') as HTMLImageElement;
    imgEl.src = imgUrl;
  }
  addOrRemoveMovingClass(state: boolean) {
    if (this.checkState(state)) {
      this.el.classList.add('moving');
    } else {
      this.el.classList.remove('moving');
    }
  }
  addOrRemoveSizingClass(state: boolean) {
    if (this.checkState(state)) {
      this.el.classList.add('sizing');
    } else {
      this.el.classList.remove('sizing');
    }
  }

  addOrRemoveLisener(state: boolean, listener: any) {
    if (!this.checkState(state)) {
      this.el.onmousedown = null;
      return;
    }
    this.el.onmousedown = listener;
  }
  move(state: boolean) {
    const methodName = 'move';
    if (!this.handlers.has(methodName)) {
      this.handlers.set(methodName, [this.getListener(methodName)]);
    }
    this.addOrRemoveLisener(state, this.handlers.get(methodName)?.at(-1));
  }
  size(state: boolean) {
    const methodName = 'size';
    if (!this.handlers.has(methodName)) {
      this.handlers.set(methodName, [this.getListener(methodName)]);
    }
    this.addOrRemoveLisener(state, this.handlers.get(methodName)?.at(-1));
  }

  private getListener(methodName: MethodName) {
    return function addMouseEvent(e: MouseEvent): void {
      e.preventDefault();
      const target = e.target as HTMLImageElement;
      const clientX = e.clientX;
      const clientY = e.clientY;
      const matrix = window.getComputedStyle(target).transform;
      const matrixStringArr = matrix.match(/matrix.*\((.+)\)/) as string[];
      if (!matrixStringArr[1]) err('matrix값이 없습니다!');

      const x = matrixStringArr[1]?.split(', ')[4];
      const y = matrixStringArr[1]?.split(', ')[5];

      const imagePositionLeft = Number(x) - clientX;
      let imagePostionTop = Number(y) - clientY;

      if (methodName === 'move') {
        document.onmousemove = (e: MouseEvent) => {
          const offsetX = imagePositionLeft + e.clientX;
          const offsetY = imagePostionTop + e.clientY;
          target.style.transform = `translate(${offsetX}px,${offsetY}px )`;
        };
      } else {
        const imgheight = Number(target.height);
        imagePostionTop = -e.clientY;
        document.onmousemove = (e: MouseEvent) => {
          const offsetY = imagePostionTop + e.clientY;
          target.height = imgheight + offsetY; // height 최적화 필요
        };
      }
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  private checkState(state: boolean): boolean {
    return state === true;
  }
};
export default ImageComponent;
