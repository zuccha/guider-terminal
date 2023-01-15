import { dim } from "https://deno.land/std@0.105.0/fmt/colors.ts";
import Node from "../node.ts";
import { padL } from "../utils.ts";

type Item = {
  text: string;
};

export default class ListNode extends Node {
  private type: "ordered" | "unordered";
  private items: Item[] = [];

  constructor(type: "ordered" | "unordered") {
    super();
    this.type = type;
  }

  addItem(text: string): void {
    this.items.push({ text });
  }

  format(): string {
    if (this.type === "unordered") {
      return this.items
        .map((item) => dim("  - ") + Node.formatText(item.text))
        .join("\n");
    }

    const digits = String(this.items.length).length;

    return this.items
      .map((item, index) => {
        const digit = `${index + 1}`;
        return (
          dim(`  ${padL(digit, digits - digit.length)}. `) +
          Node.formatText(item.text)
        );
      })
      .join("\n");
  }
}
