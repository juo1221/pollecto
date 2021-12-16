export const err = (msg: string) => {
  throw msg;
};
export const el = <T extends keyof HTMLElementTagNameMap>(v: T) => document.createElement(v);
