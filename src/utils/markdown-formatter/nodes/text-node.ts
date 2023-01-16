import Node, { defaultFormatOptions, FormatOptions } from "../node.ts";
import { breakText, formatText } from "../utils.ts";

export default class TextNode extends Node {
  private text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  format(partialOptions?: Partial<FormatOptions>): string {
    const options = { ...defaultFormatOptions, ...partialOptions };

    return formatText(breakText(this.text, options.maxWidth));
  }
}
