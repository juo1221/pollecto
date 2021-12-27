import { StateParams, GetState } from '@Custom/types';

export default class Pagination {
  private static base = new Pagination(1, 0, 6);
  static new({ totalImg, imgPerPage }: StateParams = {}) {
    const { currentPage: baseCurrent, totalImg: baseTotalImg, imgPerPage: baseImgPerPage } = Pagination.base;
    return new Pagination(
      baseCurrent,
      totalImg !== undefined ? totalImg : baseTotalImg,
      imgPerPage !== undefined ? imgPerPage : baseImgPerPage,
    );
  }
  private constructor(private currentPage: number, private totalImg: number, private imgPerPage: number) {}

  setState(newState: StateParams) {
    this.currentPage = newState.currentPage ? newState.currentPage : this.currentPage;
  }
  getState(): GetState {
    return { currentPage: this.currentPage, totalImg: this.totalImg, imgPerPage: this.imgPerPage };
  }
}
