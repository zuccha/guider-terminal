import {
  bold,
  italic,
  strikethrough,
} from "https://deno.land/std@0.105.0/fmt/colors.ts";

const boldAndItalicRegExp = /\*\*\*([^\*]+)\*\*\*/g;
const bold1RegExp = /\*\*([^\*]+)\*\*/g;
const bold2RegExp = /__([^_]+)__/g;
const italic1RegExp = /\*([^\*]+)\*/g;
const italic2RegExp = /_([^_]+)_/g;
const strikethroughRegExp = /~~([^~]+)~~/g;

export default abstract class Node {
  abstract format(): string;

  static formatText(text: string): string {
    return text
      .replace(boldAndItalicRegExp, (_, match) => bold(italic(match)))
      .replace(bold1RegExp, (_, match) => bold(match))
      .replace(bold2RegExp, (_, match) => bold(match))
      .replace(italic1RegExp, (_, match) => italic(match))
      .replace(italic2RegExp, (_, match) => italic(match))
      .replace(strikethroughRegExp, (_, match) => strikethrough(match));
  }

  static getTextLength(text: string): number {
    return text
      .replace(boldAndItalicRegExp, (_, match) => match)
      .replace(bold1RegExp, (_, match) => match)
      .replace(bold2RegExp, (_, match) => match)
      .replace(italic1RegExp, (_, match) => match)
      .replace(italic2RegExp, (_, match) => match)
      .replace(strikethroughRegExp, (_, match) => match).length;
  }
}
