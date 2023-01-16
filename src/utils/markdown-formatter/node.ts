export type FormatOptions = {
  maxWidth: number;
};

export const defaultFormatOptions: FormatOptions = {
  maxWidth: 0,
};

export default abstract class Node {
  abstract format(options?: FormatOptions): string;
}
