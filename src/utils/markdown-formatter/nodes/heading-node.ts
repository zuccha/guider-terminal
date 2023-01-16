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
import Node, { defaultFormatOptions, FormatOptions } from "../node.ts";
import { breakText, formatText } from "../utils.ts";

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

  format(partialOptions?: Partial<FormatOptions>): string {
    const options = { ...defaultFormatOptions, ...partialOptions };

    const formatHeading = (prefix: string): string => {
      const padding = " ".repeat(prefix.length);
      return (
        prefix +
        formatText(breakText(this.text, options.maxWidth, `\n${padding}`))
      );
    };

    switch (this.level) {
      case 1: {
        const heading = formatHeading(HeadingNode.Heading1Prefix);
        return underline(bold(red(heading)));
      }
      case 2: {
        const heading = formatHeading(HeadingNode.Heading2Prefix);
        return bold(yellow(heading));
      }
      case 3: {
        const heading = formatHeading(HeadingNode.Heading3Prefix);
        return bold(green(heading));
      }
      case 4: {
        const heading = formatHeading(HeadingNode.Heading4Prefix);
        return bold(magenta(heading));
      }
      case 5: {
        const heading = formatHeading(HeadingNode.Heading5Prefix);
        return bold(cyan(heading));
      }
      case 6: {
        const heading = formatHeading(HeadingNode.Heading6Prefix);
        return bold(blue(heading));
      }
    }
  }
}
