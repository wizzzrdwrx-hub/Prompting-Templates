import {
  assertConcurrentPromptIsClean,
  compilePrompt,
  makePlacedBlock,
} from "../src/modular-builder/promptCompiler";
import { PROMPT_BLOCKS } from "../src/modular-builder/promptBlocks";
import type { BuilderConfig } from "../src/modular-builder/promptBlockTypes";

const block = (id: string) => {
  const found = PROMPT_BLOCKS.find((item) => item.id === id);
  if (!found) throw new Error(`Missing block: ${id}`);
  return found;
};

describe("prompt compiler", () => {
  it("uses chronological language in consecutive mode", () => {
    const config: BuilderConfig = {
      mode: "consecutive",
      selectedDropdownBlockIds: {},
      sandboxBlocks: [
        makePlacedBlock(block("frame-vertical-triptych"), 0),
        makePlacedBlock(block("logic-consecutive-sequence"), 1),
      ],
    };

    const result = compilePrompt(config);
    expect(result.fullPrompt).toContain("Frame 1 begins");
    expect(result.fullPrompt).toContain("Frame 2 continues");
    expect(result.fullPrompt).toContain("Frame 3 concludes");
  });

  it("uses same-instant language in concurrent mode", () => {
    const config: BuilderConfig = {
      mode: "concurrent",
      selectedDropdownBlockIds: {},
      sandboxBlocks: [
        makePlacedBlock(block("frame-vertical-triptych"), 0),
        makePlacedBlock(block("logic-concurrent-same-instant"), 1),
      ],
    };

    const result = compilePrompt(config);
    expect(result.fullPrompt).toContain("exact same instant");
    expect(result.fullPrompt).toContain("separate camera vantages");
    expect(assertConcurrentPromptIsClean(result.fullPrompt)).toBe(true);
  });

  it("excludes disabled blocks", () => {
    const disabled = makePlacedBlock(block("style-moody-noir"), 0);
    disabled.state = "disabled";

    const result = compilePrompt({
      mode: "consecutive",
      selectedDropdownBlockIds: {},
      sandboxBlocks: [disabled],
    });

    expect(result.includedBlockIds).not.toContain("style-moody-noir");
  });

  it("separates negative instructions", () => {
    const result = compilePrompt({
      mode: "consecutive",
      selectedDropdownBlockIds: {},
      sandboxBlocks: [makePlacedBlock(block("negative-common-artifacts"), 0)],
    });

    expect(result.negativePrompt).toContain("Do not add text");
    expect(result.fullPrompt).toContain("Negative instructions");
  });
});
