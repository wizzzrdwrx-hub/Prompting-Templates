import React, { useMemo, useState } from "react";
import {
  BuilderConfig,
  PlacedPromptBlock,
  PromptCategory,
  StructuralMode,
} from "../modular-builder/promptBlockTypes";
import {
  getBlocksByCategory,
  PROMPT_BLOCKS,
  STRUCTURE_GUIDE,
} from "../modular-builder/promptBlocks";
import { PROMPT_PRESETS } from "../modular-builder/promptPresets";
import { compilePrompt, makePlacedBlock } from "../modular-builder/promptCompiler";
import "../styles/modularCompositePromptBuilder.css";

type Tab = "dropdowns" | "sandbox" | "preview" | "presets" | "export";

const CATEGORY_LABELS: Record<PromptCategory, string> = {
  "source-fidelity": "Source Fidelity",
  "subject-scene": "Subject / Scene",
  composition: "Composition",
  "shot-structure": "Shot Structure",
  logic: "Logic",
  "camera-vantage": "Camera / Vantage",
  "action-moment": "Action / Moment",
  style: "Style",
  "lighting-atmosphere": "Lighting / Atmosphere",
  "technical-rendering": "Technical Rendering",
  continuity: "Continuity",
  negative: "Negative",
  output: "Output",
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export function ModularCompositePromptBuilder() {
  const [mode, setMode] = useState<StructuralMode>("consecutive");
  const [activeTab, setActiveTab] = useState<Tab>("dropdowns");
  const [selectedDropdownBlockIds, setSelectedDropdownBlockIds] = useState<Record<string, string | null>>({});
  const [sandboxBlocks, setSandboxBlocks] = useState<PlacedPromptBlock[]>([]);

  const blocksByCategory = useMemo(() => getBlocksByCategory(), []);

  const config: BuilderConfig = {
    mode,
    selectedDropdownBlockIds,
    sandboxBlocks,
  };

  const compiled = useMemo(() => compilePrompt(config), [mode, selectedDropdownBlockIds, sandboxBlocks]);



  const applyPreset = (presetId: string) => {
    const preset = PROMPT_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;

    setMode(preset.defaultMode);

    const placed = preset.blockIds
      .map((id, index) => {
        const block = PROMPT_BLOCKS.find((item) => item.id === id);
        return block ? makePlacedBlock(block, index) : null;
      })
      .filter(Boolean) as PlacedPromptBlock[];

    setSandboxBlocks(placed);
    setSelectedDropdownBlockIds({});
    setActiveTab("preview");
  };

  const addBlockToSandbox = (blockId: string) => {
    const block = PROMPT_BLOCKS.find((item) => item.id === blockId);
    if (!block) return;
    setSandboxBlocks((current) => [...current, makePlacedBlock(block, current.length)]);
  };

  const updatePlacedBlock = (instanceId: string, patch: Partial<PlacedPromptBlock>) => {
    setSandboxBlocks((current) =>
      current.map((block) => (block.instanceId === instanceId ? { ...block, ...patch } : block))
    );
  };

  const removePlacedBlock = (instanceId: string) => {
    setSandboxBlocks((current) => current.filter((block) => block.instanceId !== instanceId));
  };

  const duplicatePlacedBlock = (instanceId: string) => {
    const block = sandboxBlocks.find((item) => item.instanceId === instanceId);
    if (!block) return;
    setSandboxBlocks((current) => [
      ...current,
      {
        ...block,
        instanceId: `${block.id}-${Date.now()}`,
        userOrder: current.length,
      },
    ]);
  };

  const movePlacedBlock = (instanceId: string, direction: "up" | "down") => {
    setSandboxBlocks((current) => {
      const index = current.findIndex((block) => block.instanceId === instanceId);
      if (index < 0) return current;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);

      return next.map((block, order) => ({ ...block, userOrder: order }));
    });
  };

  return (
    <section className="mcpb-shell">
      <header className="mcpb-header">
        <div>
          <p className="mcpb-kicker">Prompt Template Generator</p>
          <h1>Modular Composite Prompt Builder</h1>
          <p>
            Build copy-ready image prompts from complete, stackable prompt blocks. Consecutive mode tells time.
            Concurrent mode freezes time and changes only the camera vantages.
          </p>
        </div>

        <div className="mcpb-mode-toggle" role="group" aria-label="Structural logic mode">
          <button
            className={mode === "consecutive" ? "active" : ""}
            onClick={() => setMode("consecutive")}
            type="button"
          >
            Consecutive
            <span>Timeline sequence</span>
          </button>
          <button
            className={mode === "concurrent" ? "active" : ""}
            onClick={() => setMode("concurrent")}
            type="button"
          >
            Concurrent
            <span>Same instant, many vantages</span>
          </button>
        </div>
      </header>

      <nav className="mcpb-tabs" aria-label="Builder tabs">
        {(["dropdowns", "sandbox", "preview", "presets", "export"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab === "dropdowns" ? "Dropdown Builder" : tab === "sandbox" ? "Drag Sandbox" : tab}
          </button>
        ))}
      </nav>

      <main className="mcpb-grid">
        <div className="mcpb-workspace">
          {activeTab === "dropdowns" && (
            <div className="mcpb-panel">
              <h2>Dropdown Variable Builder</h2>
              <div className="mcpb-dropdown-grid">
                {(Object.keys(CATEGORY_LABELS) as PromptCategory[]).map((category) => {
                  const options = (blocksByCategory[category] || []).filter(
                    (block) => block.modeCompatibility === "both" || block.modeCompatibility === mode
                  );

                  return (
                    <label key={category} className="mcpb-field">
                      <span>{CATEGORY_LABELS[category]}</span>
                      <select
                        value={selectedDropdownBlockIds[category] || ""}
                        onChange={(event) =>
                          setSelectedDropdownBlockIds((current) => ({
                            ...current,
                            [category]: event.target.value || null,
                          }))
                        }
                      >
                        <option value="">Skip this category</option>
                        {options.map((block) => (
                          <option key={block.id} value={block.id}>
                            {block.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "sandbox" && (
            <div className="mcpb-sandbox-grid">
              <div className="mcpb-panel">
                <h2>Variable Bin</h2>
                {Object.entries(blocksByCategory).map(([category, blocks]) => (
                  <details key={category} open>
                    <summary>{CATEGORY_LABELS[category as PromptCategory] || category}</summary>
                    <div className="mcpb-bin-list">
                      {blocks
                        .filter((block) => block.modeCompatibility === "both" || block.modeCompatibility === mode)
                        .map((block) => (
                          <button key={block.id} type="button" onClick={() => addBlockToSandbox(block.id)}>
                            <strong>{block.label}</strong>
                            <span>{block.description}</span>
                          </button>
                        ))}
                    </div>
                  </details>
                ))}
              </div>

              <div className="mcpb-panel">
                <h2>Prompt Sandbox</h2>
                {sandboxBlocks.length === 0 ? (
                  <p className="mcpb-empty">Add blocks from the variable bin. Civilization trembles with anticipation.</p>
                ) : (
                  sandboxBlocks.map((block, index) => (
                    <article key={block.instanceId} className={`mcpb-block mcpb-block-${block.state}`}>
                      <header>
                        <strong>{index + 1}. {block.label}</strong>
                        <div>
                          <button type="button" onClick={() => movePlacedBlock(block.instanceId, "up")}>↑</button>
                          <button type="button" onClick={() => movePlacedBlock(block.instanceId, "down")}>↓</button>
                          <button type="button" onClick={() => duplicatePlacedBlock(block.instanceId)}>Duplicate</button>
                          <button type="button" onClick={() => removePlacedBlock(block.instanceId)}>Remove</button>
                        </div>
                      </header>

                      <select
                        value={block.state}
                        onChange={(event) =>
                          updatePlacedBlock(block.instanceId, {
                            state: event.target.value as PlacedPromptBlock["state"],
                          })
                        }
                      >
                        <option value="required">Required</option>
                        <option value="optional">Optional</option>
                        <option value="disabled">Disabled</option>
                      </select>

                      <textarea
                        value={block.customText ?? block.promptText}
                        onChange={(event) =>
                          updatePlacedBlock(block.instanceId, {
                            customText: event.target.value,
                          })
                        }
                      />
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="mcpb-panel">
              <h2>Live Preview</h2>
              <pre className="mcpb-prompt">{compiled.fullPrompt}</pre>
            </div>
          )}

          {activeTab === "presets" && (
            <div className="mcpb-panel">
              <h2>Saved Presets</h2>
              <div className="mcpb-preset-grid">
                {PROMPT_PRESETS.map((preset) => (
                  <button key={preset.id} type="button" onClick={() => applyPreset(preset.id)}>
                    <strong>{preset.label}</strong>
                    <span>{preset.defaultMode}</span>
                    <p>{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div className="mcpb-panel">
              <h2>Export</h2>
              <button type="button" onClick={() => copyToClipboard(compiled.jsonConfig)}>Copy JSON Configuration</button>
              <button type="button" onClick={() => copyToClipboard(compiled.markdownPromptCard)}>Copy Markdown Prompt Card</button>
              <pre className="mcpb-prompt">{compiled.jsonConfig}</pre>
            </div>
          )}
        </div>

        <aside className="mcpb-live">
          <h2>Compiled Prompt</h2>
          <div className="mcpb-copy-row">
            <button type="button" onClick={() => copyToClipboard(compiled.fullPrompt)}>Copy Full</button>
            <button type="button" onClick={() => copyToClipboard(compiled.positivePrompt)}>Copy Positive</button>
            <button type="button" onClick={() => copyToClipboard(compiled.negativePrompt)}>Copy Negative</button>
          </div>
          <pre className="mcpb-prompt">{compiled.fullPrompt}</pre>

          <h3>Structure Guide</h3>
          <ol className="mcpb-guide">
            {STRUCTURE_GUIDE.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </aside>
      </main>
    </section>
  );
}
