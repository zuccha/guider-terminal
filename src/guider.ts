import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";
import {
  GenericInstruction,
  Guide,
  parseGuide,
} from "https://raw.githubusercontent.com/zuccha/guider/0.5.0/mod.ts";
import formatMarkdown from "./utils/markdown-formatter/formatMarkdown.ts";

export const run = async (): Promise<void> => {
  const fileName = Deno.args[0];

  const flags = parse(Deno.args, {
    boolean: [
      "collapse-instruction-groups",
      "hide-comments",
      "hide-instruction-id",
      "hide-optional",
      "hide-safety",
      "raw",
    ],
    string: ["ignored-rules", "max-width"],
  });

  if (!fileName) {
    console.error("No file name given");
    Deno.exit(1);
  }

  try {
    await Deno.stat(fileName);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`File "${fileName}" was not found`);
    } else {
      console.error(`Failed to locate file "${fileName}"`);
    }
    Deno.exit(1);
  }

  let fileContent: string;
  try {
    fileContent = await Deno.readTextFile(fileName);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`File "${fileName}" was not found`);
    } else {
      console.error(`Failed read "${fileName}"`);
    }
    Deno.exit(1);
  }

  let guide: Guide<GenericInstruction>;
  try {
    guide = parseGuide(fileContent);
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }

  const ignoredRules = (flags["ignored-rules"] ?? "")
    .split(",")
    .map((rule) => (isNaN(Number(rule)) ? -1 : Number(rule)))
    .filter((rule) => rule !== -1);

  const output = guide.format({
    collapseInstructionGroups: flags["collapse-instruction-groups"],
    hideComments: flags["hide-comments"],
    hideInstructionId: flags["hide-instruction-id"],
    hideOptional: flags["hide-optional"],
    hideSafety: flags["hide-safety"],
    ignoredRules,
  });

  const maxWidth = Number(flags["max-width"]) || 0;

  console.log(flags["raw"] ? output : formatMarkdown(output, { maxWidth }));
};
