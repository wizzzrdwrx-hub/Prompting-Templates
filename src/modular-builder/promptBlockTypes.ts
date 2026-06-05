export type StructuralMode = "consecutive" | "concurrent";

export type ModeCompatibility = StructuralMode | "both";

export type PromptCategory =
  | "source-fidelity"
  | "subject-scene"
  | "composition"
  | "shot-structure"
  | "logic"
  | "camera-vantage"
  | "action-moment"
  | "style"
  | "lighting-atmosphere"
  | "technical-rendering"
  | "continuity"
  | "negative"
  | "output";

export type BlockState = "required" | "optional" | "disabled";

export interface PromptBlock {
  id: string;
  label: string;
  category: PromptCategory;
  description: string;
  promptText: string;
  modeCompatibility: ModeCompatibility;
  defaultEnabled: boolean;
  required: boolean;
  sortOrder: number;
  tags: string[];
  negativePromptCompatible: boolean;
  exampleUse: string;
  priority: number;
  weight: number;
  supportsShotNumber: boolean;
  supportsVantage: boolean;
  supportsTimeline: boolean;
  supportsSameMomentContinuity: boolean;
}

export interface PlacedPromptBlock extends PromptBlock {
  instanceId: string;
  state: BlockState;
  customText?: string;
  collapsed?: boolean;
  userOrder: number;
}

export interface PromptPreset {
  id: string;
  label: string;
  description: string;
  defaultMode: StructuralMode;
  blockIds: string[];
  tags: string[];
}

export interface BuilderConfig {
  mode: StructuralMode;
  selectedDropdownBlockIds: Record<string, string | null>;
  sandboxBlocks: PlacedPromptBlock[];
  activePresetId?: string;
}

export interface CompiledPrompt {
  fullPrompt: string;
  positivePrompt: string;
  negativePrompt: string;
  jsonConfig: string;
  markdownPromptCard: string;
  includedBlockIds: string[];
  excludedBlockIds: string[];
}
