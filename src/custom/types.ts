type Infos = {
  readonly urlArr: string[];
  readonly imgPerPage: number;
};

type StateParams = {
  currentPage?: number;
  totalImg?: number;
  imgPerPage?: number;
};
type GetState = Required<StateParams>;

type BtnComponentState = {
  isActivated: boolean;
};

type AddImage = {
  cnt: number;
  image: Image;
  imgPerPage: number;
};
type DialogConstructor = {
  new (): Dialog & Component;
};
type SetAndAddImage = {
  cnt: number;
  imgPerPage: number;
  currentPage: number;
  image: Image;
};
type MethodName = 'move' | 'size' | 'zoom';
interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
}
interface Composable {
  addChild(child: Component): void;
}
interface PageContainer extends Component, Composable {
  setImg(currentPage: number, img: Image): void;
  getImg(currentPage: number): Set<Image>;
  getAllImg(): Image[][];
  imgArrClear(): void;
}
interface SectionContainer extends Component, Composable {
  reset(): void;
}
interface Dialog {
  get infos(): Infos;
  get renderBtn(): HTMLElement;
  add: () => void;
  close: () => void;
}
interface Pagination {
  new ({ totalImg, imgPerPage }: StateParams): Pagination;
  setState(newState: StateParams): void;
  getState(): GetState;
}
interface Button {
  toggle(...btns: Button[]): void;
  reset(): void;
  get state(): BtnComponentState;
}
interface Image extends Component {
  addOrRemoveMovingClass(state: boolean): void;
  addOrRemoveSizingClass(state: boolean): void;
  move(state: boolean): void;
  size(state: boolean): void;
}
