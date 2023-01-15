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
