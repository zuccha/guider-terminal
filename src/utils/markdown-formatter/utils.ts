import {
  bold,
  italic,
  strikethrough,
} from "https://deno.land/std@0.105.0/fmt/colors.ts";

export type Alignment = "left" | "center" | "right";

export const padL = (text: string, padding: number): string => {
  return `${" ".repeat(padding)}${text}`;
};

export const padR = (text: string, padding: number): string => {
  return `${text}${" ".repeat(padding)}`;
};

export const padC = (text: string, padding: number): string => {
  const l = " ".repeat(Math.ceil(padding / 2));
  const r = " ".repeat(Math.floor(padding / 2));
  return `${l}${text}${r}`;
};

export const pad = (
  text: string,
  padding: number,
  alignment: Alignment
): string => {
  if (alignment === "right") return padL(text, padding);
  if (alignment === "left") return padR(text, padding);
  return padC(text, padding);
};

const boldAndItalicRegExp = /\*\*\*([^\*]+)\*\*\*/g;
const bold1RegExp = /\*\*([^\*]+)\*\*/g;
const bold2RegExp = /__([^_]+)__/g;
const italic1RegExp = /\*([^\*]+)\*/g;
const italic2RegExp = /_([^_]+)_/g;
const strikethroughRegExp = /~~([^~]+)~~/g;

export const formatText = (text: string): string => {
  return text
    .replace(boldAndItalicRegExp, (_, match) => bold(italic(match)))
    .replace(bold1RegExp, (_, match) => bold(match))
    .replace(bold2RegExp, (_, match) => bold(match))
    .replace(italic1RegExp, (_, match) => italic(match))
    .replace(italic2RegExp, (_, match) => italic(match))
    .replace(strikethroughRegExp, (_, match) => strikethrough(match));
};

export const getTextLength = (text: string): number => {
  return text
    .replace(boldAndItalicRegExp, (_, match) => match)
    .replace(bold1RegExp, (_, match) => match)
    .replace(bold2RegExp, (_, match) => match)
    .replace(italic1RegExp, (_, match) => match)
    .replace(italic2RegExp, (_, match) => match)
    .replace(strikethroughRegExp, (_, match) => match).length;
};
