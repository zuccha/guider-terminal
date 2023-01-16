import { bold, blue } from "https://deno.land/std@0.105.0/fmt/colors.ts";
import Node, { defaultFormatOptions, FormatOptions } from "../node.ts";
import {
  Alignment,
  breakText,
  formatText,
  getTextLength,
  pad,
  padR,
} from "../utils.ts";

type Column = {
  header: string;
  alignment: Alignment;
  width: number;
};

enum Border {
  BottomLeft = "└",
  BottomMiddle = "┴",
  BottomRight = "┘",
  Horizontal = "─",
  MiddleLeft = "├",
  MiddleMiddle = "┼",
  MiddleRight = "┤",
  TopLeft = "┌",
  TopMiddle = "┬",
  TopRight = "┐",
  Vertical = "│",
}

const PaddingSize = 1;

export default class TableNode extends Node {
  private header: string[] = [];
  private alignments: Alignment[] = [];
  private rows: string[][] = [];

  setHeader(header: string[]): void {
    this.header = header;
  }

  setAlignments(alignments: Alignment[]): void {
    this.alignments = alignments;
  }

  addRow(row: string[]): void {
    this.rows.push(row);
  }

  format(partialOptions?: Partial<FormatOptions>): string {
    const options = { ...defaultFormatOptions, ...partialOptions };

    const columnsCount = Math.max(
      this.header.length,
      this.alignments.length,
      ...this.rows.map((row) => row.length)
    );

    const columns: Column[] = [];
    for (let i = 0; i < columnsCount; ++i) {
      const header = this.header[i] ?? "";
      const alignment = this.alignments[i] ?? "left";

      const width = Math.max(
        getTextLength(header),
        ...this.rows.map((row) => {
          const cell = row[i] ?? "";
          const subcells = cell.split("<br>");
          return Math.max(
            ...subcells.map((subcell) => getTextLength(subcell.trim()))
          );
        })
      );

      columns.push({ header, alignment, width });
    }

    const bordersWidth =
      Border.MiddleLeft.length +
      Border.Vertical.length * (columns.length - 1) +
      Border.MiddleRight.length +
      columns.length * PaddingSize * 2;
    const tableWidth =
      columns.reduce((sum, column) => sum + column.width, 0) + bordersWidth;
    if (options.maxWidth > 0 && tableWidth > options.maxWidth) {
      const availableWidth = Math.max(options.maxWidth - bordersWidth, 0);
      const averageWidth = Math.floor(availableWidth / columns.length);
      let aboveAverageColumnCount = 0;
      let leftoverWidth = 0;

      for (const column of columns) {
        if (column.width > averageWidth) {
          aboveAverageColumnCount++;
        } else {
          leftoverWidth += averageWidth - column.width;
        }
      }

      const averageLeftoverWidth = Math.floor(
        leftoverWidth / aboveAverageColumnCount
      );
      for (const column of columns) {
        if (column.width > averageWidth) {
          column.width = averageWidth + averageLeftoverWidth;
        }
      }
    }

    const separatorTop =
      Border.TopLeft +
      columns
        .map((column) =>
          Border.Horizontal.repeat(column.width + 2 * PaddingSize)
        )
        .join(Border.TopMiddle) +
      Border.TopRight +
      "\n";

    const separatorMiddle =
      Border.MiddleLeft +
      columns
        .map((column) =>
          Border.Horizontal.repeat(column.width + 2 * PaddingSize)
        )
        .join(Border.MiddleMiddle) +
      Border.MiddleRight +
      "\n";

    const separatorBottom =
      Border.BottomLeft +
      columns
        .map((column) =>
          Border.Horizontal.repeat(column.width + 2 * PaddingSize)
        )
        .join(Border.BottomMiddle) +
      Border.BottomRight +
      "\n";

    const padding = " ".repeat(PaddingSize);

    const splitSubrows = (row: string[]): string[][] => {
      const subrows: string[][] = [];

      for (let i = 0; i < columns.length; ++i) {
        const cell = breakText(row[i] ?? "", columns[i].width, "<br>");
        const subcells = cell.split("<br>").map((subcell) => subcell.trim());
        for (let j = 0; j < subcells.length; ++j) {
          const subcell = subcells[j];
          if (!subrows[j]) subrows[j] = [];
          subrows[j][i] = subcell;
        }
      }

      for (let j = 0; j < subrows.length; ++j) {
        for (let i = 0; i < columns.length; ++i) {
          if (!subrows[j][i]) subrows[j][i] = "";
        }
      }

      return subrows;
    };

    let formattedTable = "";

    formattedTable += separatorTop;
    formattedTable += splitSubrows(columns.map((column) => column.header))
      .map(
        (subrow) =>
          Border.Vertical +
          subrow
            .map((cell, i) => {
              const column = columns[i];
              const headerLength = getTextLength(cell);
              const fill = Math.max(column.width - headerLength, 0);
              const text = formatText(padR(cell, fill));
              return padding + bold(blue(text)) + padding;
            })
            .join(Border.Vertical) +
          Border.Vertical +
          "\n"
      )
      .join("");
    formattedTable += separatorMiddle;

    formattedTable += this.rows
      .map((row) => {
        return splitSubrows(row)
          .map(
            (subrow) =>
              Border.Vertical +
              subrow
                .map((cell, i) => {
                  const column = columns[i];
                  const cellLength = getTextLength(cell);
                  const fill = Math.max(column.width - cellLength, 0);
                  const text = formatText(pad(cell, fill, column.alignment));
                  return padding + text + padding;
                })
                .join(Border.Vertical) +
              Border.Vertical +
              "\n"
          )
          .join("");
      })
      .join(separatorMiddle);

    formattedTable += separatorBottom;

    return formattedTable;
  }
}
