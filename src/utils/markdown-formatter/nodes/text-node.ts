import Node from "../node.ts";

export default class TextNode extends Node {
  private text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  format(): string {
    const formattedText = Node.formatText(this.text);

    return formattedText;
  }
}
