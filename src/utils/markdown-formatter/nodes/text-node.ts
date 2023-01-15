import Node from "../node.ts";
import { formatText } from "../utils.ts";

export default class TextNode extends Node {
  private text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  format(): string {
    return formatText(this.text);
  }
}
