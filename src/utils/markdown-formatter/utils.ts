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

const boldAndItalicRegExp = /\*\*\*([^\*]+)\*\*\*/gm;
const bold1RegExp = /\*\*([^\*]+)\*\*/gm;
const bold2RegExp = /__([^_]+)__/gm;
const italic1RegExp = /\*([^\*]+)\*/gm;
const italic2RegExp = /_([^_]+)_/gm;
const strikethroughRegExp = /~~([^~]+)~~/g;
const breakRegExp = /<br>/g;

export const formatText = (text: string): string => {
  return text
    .replace(boldAndItalicRegExp, (_, match) => bold(italic(match)))
    .replace(bold1RegExp, (_, match) => bold(match))
    .replace(bold2RegExp, (_, match) => bold(match))
    .replace(italic1RegExp, (_, match) => italic(match))
    .replace(italic2RegExp, (_, match) => italic(match))
    .replace(strikethroughRegExp, (_, match) => strikethrough(match))
    .replace(breakRegExp, "");
};

export const getTextLength = (text: string): number => {
  return text
    .replace(boldAndItalicRegExp, (_, match) => match)
    .replace(bold1RegExp, (_, match) => match)
    .replace(bold2RegExp, (_, match) => match)
    .replace(italic1RegExp, (_, match) => match)
    .replace(italic2RegExp, (_, match) => match)
    .replace(strikethroughRegExp, (_, match) => match)
    .replace(breakRegExp, "").length;
};

type Formatting = { type: "***" | "**" | "__" | "*" | "_" | "~~" };
const formattingTypes = ["***", "**", "__", "*", "_", "~~"] as const;

export const breakText = (
  text: string,
  width: number,
  separator = "\n"
): string => {
  if (width === 0) {
    return text;
  }

  let chunks: (string | Formatting)[] = [text];
  for (const formattingType of formattingTypes) {
    const newChunks: (string | Formatting)[] = [];

    for (const chunk of chunks) {
      if (typeof chunk === "string") {
        const subchunks = chunk.split(formattingType);
        newChunks.push(subchunks[0]);
        for (let i = 1; i < subchunks.length; ++i) {
          newChunks.push({ type: formattingType });
          newChunks.push(subchunks[i]);
        }
      } else {
        newChunks.push(chunk);
      }
    }

    chunks = newChunks;
  }

  chunks = chunks
    .map((chunk) =>
      typeof chunk === "string" ? chunk.split(/(\s)/g) : [chunk]
    )
    .flat()
    .filter((chunk) => typeof chunk !== "string" || chunk !== "");

  const firstWordIndex = chunks.findIndex((chunk) => typeof chunk === "string");
  if (firstWordIndex === -1) {
    return text;
  }

  const lines: (string | Formatting)[][] = [[]];
  let lastLineLength = 0;
  let formattingStack: Formatting["type"][] = [];

  for (const chunk of chunks) {
    if (typeof chunk === "string") {
      const word = chunk;
      const last = lines.length - 1;
      const wordLength = getTextLength(word);
      if (lastLineLength + 1 + wordLength > width) {
        const strippedFormatting: Formatting["type"][] = [];
        while (
          lines[last].length - 1 > 0 &&
          typeof lines[last][lines[last].length - 1] !== "string"
        ) {
          const formatting = lines[last].pop() as Formatting;
          strippedFormatting.push(formatting.type);
        }
        const closingFormatting = formattingStack
          .filter((type) => !strippedFormatting.includes(type))
          .reverse();
        lines[last].push(...closingFormatting);
        lines.push([...formattingStack, word]);
        lastLineLength = wordLength;
      } else {
        lines[last].push(word);
        lastLineLength += wordLength;
      }
    } else {
      const formatting = chunk;
      if (formattingStack.includes(formatting.type)) {
        formattingStack = formattingStack.filter(
          (formattingType) => formattingType !== formatting.type
        );
      } else {
        formattingStack.push(formatting.type);
      }
      const last = lines.length - 1;
      lines[last].push(formatting);
    }
  }

  return lines
    .map((line) =>
      line
        .map((chunk) => (typeof chunk === "string" ? chunk : chunk.type))
        .join("")
        .trim()
    )
    .join(separator);
};
