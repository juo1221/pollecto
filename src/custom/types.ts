export type Infos = {
  readonly urlArr: string[];
  readonly imgPerPage: number;
};

export type StateParams = {
  currentPage?: number;
  totalImg?: number;
  imgPerPage?: number;
};
export type GetState = Required<StateParams>;

export type BtnComponentState = {
  isActivated: boolean;
};

export type AddImage = {
  cnt: number;
  image: Image;
  imgPerPage: number;
};
export type DialogConstructor = {
  new (): Dialog & Component;
};
export type SetAndAddImage = {
  cnt: number;
  imgPerPage: number;
  currentPage: number;
  image: Image;
};
export type MethodName = 'move' | 'size' | 'zoom';

export type Listener = (e: MouseEvent) => void;
export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
}
export interface Composable {
  addChild(child: Component): void;
}
export interface PageContainer extends Component, Composable {
  setImg(currentPage: number, img: Image): void;
  getImg(currentPage: number): Set<Image>;
  getAllImg(): Image[][];
  imgArrClear(): void;
  zoomIn(): void;
  zoomOut(): void;
}
export interface SectionContainer extends Component, Composable {
  reset(): void;
  getChildren(): Element | null;
}
export interface Dialog {
  get infos(): Infos;
  get renderBtn(): HTMLElement;
  add(): void;
  close(): void;
}
export interface Pagination {
  new ({ totalImg, imgPerPage }: StateParams): Pagination;
  setState(newState: StateParams): void;
  getState(): GetState;
}
export interface Button {
  toggleAndRemove(...btns: Button[]): void;
  reset(): void;
  get state(): BtnComponentState;
}
export interface Image extends Component {
  addOrRemoveMovingClass(state: boolean): void;
  addOrRemoveSizingClass(state: boolean): void;
  move(state: boolean): void;
  size(state: boolean): void;
}
