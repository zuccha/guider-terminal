import Node, { FormatOptions } from "./node.ts";
import HeadingNode from "./nodes/heading-node.ts";
import ListNode from "./nodes/list-node.ts";
import TableNode from "./nodes/table-node.ts";
import TextNode from "./nodes/text-node.ts";

const formatMarkdown = (text: string, options?: FormatOptions): string => {
  const lines = text.split("\n");

  const nodes: Node[] = [];

  let orderedList: ListNode | undefined;
  const finalizeOrderedList = () => {
    if (orderedList) {
      nodes.push(orderedList);
      orderedList = undefined;
    }
  };

  let unorderedList: ListNode | undefined;
  const finalizeUnorderedList = () => {
    if (unorderedList) {
      nodes.push(unorderedList);
      unorderedList = undefined;
    }
  };

  let table: TableNode | undefined;
  const finalizeTable = () => {
    if (table) {
      nodes.push(table);
      table = undefined;
    }
  };

  for (const line of lines) {
    if (/^[\*-]\s/.test(line)) {
      finalizeOrderedList();
      finalizeTable();

      if (!unorderedList) unorderedList = new ListNode("unordered");
      unorderedList.addItem(line.replace(/^[\*-]\s/, "").trim());

      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      finalizeUnorderedList();
      finalizeTable();

      if (!orderedList) orderedList = new ListNode("ordered");
      orderedList.addItem(line.replace(/^\d+\.\s/, "").trim());

      continue;
    }

    if (line.startsWith("|") && line.endsWith("|") && line.length > 2) {
      finalizeOrderedList();
      finalizeUnorderedList();

      const row = line
        .slice(1, line.length - 1)
        .split("|")
        .map((cell) => cell.trim());

      if (!table) {
        table = new TableNode();
        table.setHeader(row);
        continue;
      }

      if (row.every((cell) => /^:?-+:?$/.test(cell))) {
        table.setAlignments(
          row.map((cell) => {
            if (cell.startsWith(":") && cell.endsWith(":")) {
              return "center";
            }
            if (cell.endsWith(":")) {
              return "right";
            }
            return "left";
          })
        );
        continue;
      }

      table.addRow(row);
      continue;
    }

    finalizeOrderedList();
    finalizeUnorderedList();
    finalizeTable();

    if (line.startsWith(HeadingNode.Heading6Prefix)) {
      const text = line.replace(HeadingNode.Heading6Prefix, "");
      nodes.push(new HeadingNode(text, 6));
      continue;
    }
    if (line.startsWith(HeadingNode.Heading5Prefix)) {
      const text = line.replace(HeadingNode.Heading5Prefix, "");
      nodes.push(new HeadingNode(text, 5));
      continue;
    }
    if (line.startsWith(HeadingNode.Heading4Prefix)) {
      const text = line.replace(HeadingNode.Heading4Prefix, "");
      nodes.push(new HeadingNode(text, 4));
      continue;
    }
    if (line.startsWith(HeadingNode.Heading3Prefix)) {
      const text = line.replace(HeadingNode.Heading3Prefix, "");
      nodes.push(new HeadingNode(text, 3));
      continue;
    }
    if (line.startsWith(HeadingNode.Heading2Prefix)) {
      const text = line.replace(HeadingNode.Heading2Prefix, "");
      nodes.push(new HeadingNode(text, 2));
      continue;
    }
    if (line.startsWith(HeadingNode.Heading1Prefix)) {
      const text = line.replace(HeadingNode.Heading1Prefix, "");
      nodes.push(new HeadingNode(text, 1));
      continue;
    }

    nodes.push(new TextNode(line));
  }

  finalizeTable();

  return nodes
    .map((node) => node.format(options))
    .filter((formattedNode) => formattedNode !== "")
    .join("\n\n");
};

export default formatMarkdown;
