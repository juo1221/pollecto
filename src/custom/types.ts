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
  image: ItemComponent;
  imgPerPage: number;
};
type DialogConstructor = {
  new (): Dialog & Component;
};
interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
}
interface Composable {
  addChild(child: Component): void;
}
interface SectionContainer extends Component, Composable {
  addItems(item: ItemComponent): void;
  getItems(): ItemComponent[];
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
interface BtnComponent {
  toggle(): void;
  get state(): BtnComponentState;
}
interface ItemComponent extends Component {
  move(state: boolean): void;
}
