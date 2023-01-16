import { dim } from "https://deno.land/std@0.105.0/fmt/colors.ts";
import Node, { defaultFormatOptions, FormatOptions } from "../node.ts";
import { breakText, formatText, padL } from "../utils.ts";

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

  format(partialOptions?: Partial<FormatOptions>): string {
    const options = { ...defaultFormatOptions, ...partialOptions };

    if (this.type === "unordered") {
      return this.items
        .map(
          (item) =>
            dim("  - ") +
            formatText(breakText(item.text, options.maxWidth, "\n    "))
        )
        .join("\n");
    }

    const digits = String(this.items.length).length;

    return this.items
      .map((item, index) => {
        const digit = `${index + 1}`;
        return (
          dim(`  ${padL(digit, digits - digit.length)}. `) +
          formatText(breakText(item.text, options.maxWidth, "\n     "))
        );
      })
      .join("\n");
  }
}
