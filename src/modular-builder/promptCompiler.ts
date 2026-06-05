import type {
  BuilderConfig,
  CompiledPrompt,
  PlacedPromptBlock,
  PromptBlock,
  StructuralMode,
} from "./promptBlockTypes";
import { PROMPT_BLOCKS } from "./promptBlocks";

const CONCURRENT_FORBIDDEN_WORDS = [" then ", " next ", " afterward ", " concludes ", " later "];

export function isBlockModeCompatible(block: PromptBlock, mode: StructuralMode) {
  return block.modeCompatibility === "both" || block.modeCompatibility === mode;
}

export function makePlacedBlock(block: PromptBlock, userOrder = 0): PlacedPromptBlock {
  return {
    ...block,
    instanceId: `${block.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    state: block.required ? "required" : block.defaultEnabled ? "optional" : "disabled",
    collapsed: false,
    userOrder,
  };
}

export function getModeBridge(mode: StructuralMode) {
  if (mode === "consecutive") {
    return [
      "Use Consecutive Mode: the frames represent chronological progression over time.",
      "Frame 1 begins the visual action, Frame 2 continues it, and Frame 3 concludes with a clear ending beat.",
      "The sequence should show a beginning, middle, and end with natural frame-to-frame continuity.",
    ].join(" ");
  }

  return [
    "Use Concurrent Mode: all frames represent the exact same instant captured simultaneously from separate camera vantages.",
    "There is no chronological progression; only the viewpoint, distance, lens, and angle change between frames.",
    "Keep identical subject pose, action state, wardrobe, lighting conditions, environment, and scene continuity across every frame.",
  ].join(" ");
}

export function sanitizeConcurrentLanguage(text: string) {
  return text
    .replace(/Frame 1 begins/gi, "Frame 1 shows")
    .replace(/Frame 2 continues/gi, "Frame 2 shows")
    .replace(/Frame 3 concludes/gi, "Frame 3 shows")
    .replace(/\bthen\b/gi, "simultaneously")
    .replace(/\bnext\b/gi, "also")
    .replace(/\bafterward\b/gi, "at the same instant")
    .replace(/\blater in the sequence\b/gi, "from another vantage")
    .replace(/\bchronological\b/gi, "same-instant multi-vantage");
}

export function compilePrompt(config: BuilderConfig): CompiledPrompt {
  const selectedDropdownIds = Object.values(config.selectedDropdownBlockIds).filter(Boolean) as string[];
  const dropdownBlocks = selectedDropdownIds
    .map((id) => PROMPT_BLOCKS.find((block) => block.id === id))
    .filter(Boolean)
    .map((block, index) => makePlacedBlock(block as PromptBlock, index));

  const combined = [...dropdownBlocks, ...config.sandboxBlocks];

  const included = combined
    .filter((block) => block.state !== "disabled")
    .filter((block) => isBlockModeCompatible(block, config.mode))
    .sort((a, b) => {
      const bySort = a.sortOrder - b.sortOrder;
      if (bySort !== 0) return bySort;
      const byPriority = b.priority - a.priority;
      if (byPriority !== 0) return byPriority;
      return a.userOrder - b.userOrder;
    });

  const excluded = combined.filter(
    (block) => block.state === "disabled" || !isBlockModeCompatible(block, config.mode)
  );

  const modeBridge = getModeBridge(config.mode);

  const positives = included
    .filter((block) => !block.negativePromptCompatible)
    .map((block) => block.customText?.trim() || block.promptText.trim())
    .filter(Boolean);

  const negatives = included
    .filter((block) => block.negativePromptCompatible)
    .map((block) => block.customText?.trim() || block.promptText.trim())
    .filter(Boolean);

  let positivePrompt = [modeBridge, ...positives].join("\n\n");

  if (config.mode === "concurrent") {
    positivePrompt = sanitizeConcurrentLanguage(positivePrompt);
  }

  const negativePrompt = negatives.join("\n\n");
  const fullPrompt = negativePrompt
    ? `${positivePrompt}\n\nNegative instructions:\n${negativePrompt}`
    : positivePrompt;

  const jsonObject = {
    mode: config.mode,
    activePresetId: config.activePresetId ?? null,
    includedBlockIds: included.map((block) => block.id),
    excludedBlockIds: excluded.map((block) => block.id),
    sandboxBlocks: config.sandboxBlocks.map((block) => ({
      id: block.id,
      instanceId: block.instanceId,
      state: block.state,
      customText: block.customText ?? null,
      userOrder: block.userOrder,
    })),
  };

  const markdownPromptCard = [
    `# Modular Composite Prompt`,
    ``,
    `Mode: ${config.mode}`,
    ``,
    `## Positive Prompt`,
    positivePrompt,
    ``,
    `## Negative Prompt`,
    negativePrompt || "None.",
    ``,
    `## Included Blocks`,
    ...included.map((block) => `- ${block.label} (${block.id})`),
  ].join("\n");

  return {
    fullPrompt,
    positivePrompt,
    negativePrompt,
    jsonConfig: JSON.stringify(jsonObject, null, 2),
    markdownPromptCard,
    includedBlockIds: included.map((block) => block.id),
    excludedBlockIds: excluded.map((block) => block.id),
  };
}

export function assertConcurrentPromptIsClean(prompt: string) {
  const normalized = ` ${prompt.toLowerCase()} `;
  return CONCURRENT_FORBIDDEN_WORDS.every((word) => !normalized.includes(word));
}
