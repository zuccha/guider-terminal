import {
  underline,
  red,
  yellow,
  green,
  magenta,
  cyan,
  blue,
  bold,
} from "https://deno.land/std@0.105.0/fmt/colors.ts";
import Node from "../node.ts";
import { formatText } from "../utils.ts";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export default class HeadingNode extends Node {
  static Heading1Prefix = "# ";
  static Heading2Prefix = "## ";
  static Heading3Prefix = "### ";
  static Heading4Prefix = "#### ";
  static Heading5Prefix = "##### ";
  static Heading6Prefix = "###### ";

  private text: string;
  private level: Level;

  constructor(text: string, level: Level) {
    super();
    this.text = text;
    this.level = level;
  }

  format(): string {
    const formattedText = formatText(this.text);

    switch (this.level) {
      case 1: {
        const heading = `${HeadingNode.Heading1Prefix} ${formattedText}`;
        return underline(bold(red(heading)));
      }
      case 2: {
        const heading = `${HeadingNode.Heading2Prefix} ${formattedText}`;
        return bold(yellow(heading));
      }
      case 3: {
        const heading = `${HeadingNode.Heading3Prefix} ${formattedText}`;
        return bold(green(heading));
      }
      case 4: {
        const heading = `${HeadingNode.Heading4Prefix} ${formattedText}`;
        return bold(magenta(heading));
      }
      case 5: {
        const heading = `${HeadingNode.Heading5Prefix} ${formattedText}`;
        return bold(cyan(heading));
      }
      case 6: {
        const heading = `${HeadingNode.Heading6Prefix} ${formattedText}`;
        return bold(blue(heading));
      }
    }
  }
}
