import BaseComponent from '../base/base';
import { err, el } from '@Custom/funtions';
import { LIMIT } from '@Common/constant';
// import * as html2pdf from 'html2pdf.js';

// const element = document.querySelector('#element');

const DialogComponent = class extends BaseComponent<HTMLElement> implements Dialog {
  private urlArr: string[] = [];
  private imgPerPage: number = 4;
  // private sort: string = 'C';
  // private line: string = 'On';

  constructor() {
    super(`
      <aside class="dialog">
        <div class="dialog-top">
          <span class="title">Export |</span>
          <div class="top-buttons">
            <button class="btn btn-export"><i class="fas fa-file-pdf"></i></button>
            <button class="btn btn-close"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div class="container">
          <div class="dialog-fileloader">
            <div class="fileloader-buttons">
              <label for="img-upload" class="btn btn-image" ><i class="far fa-images"></i></label>
              <button class="btn btn-remove btn-removeAll"><i class="far fa-trash-alt"></i></button>
            </div>
            <input type="file" id="img-upload" class="upload-hidden" multiple ></input>
            <ul class="urlLists"></ul>
          </div>
          <div class="dialog-options">
            <h1 class="option-title">OPTIONS</h1>
            <p>Img / Page</p>
            <select class="imgPerCnt">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option selected>4</option>
            <option>5</option>
            <option>6</option>
            </select>
    
            <p>Sort</p>
            <div class="sort-btns">
              <span class="btn btn-left">L</span>
              <span class="btn btn-center">C</span>
              <span class="btn btn-right">R</span>
            </div>
            <p>Line</p>
            <div class="line-btns">
              <span class="btn btn-on">On</span>
              <span class="btn btn-off">Off</span>
            </div>
          </div>
          <div class="dialog-start">
            <button class="btn-play"><i class="fas fa-play"></i></button>
          </div>
        </div>
      </aside>
  `);

    const urlLists = this.el.querySelector('.urlLists') as HTMLUListElement;
    this.el.querySelector('.btn-removeAll')?.addEventListener('click', () => {
      urlLists.innerHTML = '';
      this.urlArr = [];
    });

    const uploadBtn = this.el.querySelector('.btn-image');
    uploadBtn?.addEventListener('click', () => {
      const fileInput = this.el.querySelector('#img-upload') as HTMLInputElement;
      fileInput.onchange = async (e: Event) => {
        urlLists.innerHTML = '';
        const target = e.target as HTMLInputElement;
        const fileList = target.files as FileList;
        const fileListArr = [...Object.values(fileList)];
        if (!fileListArr.length) err('invalid file length');

        for (let file of fileListArr) {
          const li = urlLists.appendChild(el('li'));
          if (li) {
            li.innerHTML = `
              <div>${file.name}</div>
              <button class="btn btn-remove"><i class="far fa-trash-alt"></i></button>
              `;
            li.classList.add('list');
            li.querySelector('.btn-remove')?.addEventListener('click', async () => {
              urlLists.removeChild(li);
              fileListArr.splice(fileListArr.indexOf(file), 1);
              this.urlArr = await this.convertFileToString(fileListArr);
            });
          }
        }
        this.urlArr = await this.convertFileToString(fileListArr);
        this.validate();
      };
    });

    const exportBtn = this.el.querySelector('.btn-export') as HTMLButtonElement;
    exportBtn.addEventListener('click', () => {});

    const input = this.el.querySelector('.imgPerCnt') as HTMLInputElement;
    input.onchange = () => {
      this.validate();
      this.imgPerPage = Number(input.value);
    };
  }

  get infos(): Infos {
    const infos = {
      urlArr: this.urlArr,
      imgPerPage: this.imgPerPage,
    };
    return infos;
  }
  get renderBtn(): HTMLElement {
    return this.el.querySelector('.btn-play') as HTMLButtonElement;
  }
  get pdfBtn(): HTMLElement {
    return this.el.querySelector('.btn-export') as HTMLButtonElement;
  }
  add() {
    document.body.classList.toggle('dialog--active');
  }
  close() {
    document.body.classList.toggle('dialog--active');
  }
  private convertFileToString(imgUrls: File[]) {
    return Promise.all(imgUrls.map((url) => this.readAsDataUrl(url)));
  }
  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') res(fileReader.result);
      };
      fileReader.onerror = () => {
        rej(fileReader);
      };
      fileReader.readAsDataURL(file);
    });
  }
  private validate() {
    if (this.urlArr.length > this.imgPerPage * LIMIT) {
      alert(`이미지 개수가 ${this.urlArr.length - this.imgPerPage * LIMIT}개 초과합니다.`);
    }
  }
};

export default DialogComponent;
