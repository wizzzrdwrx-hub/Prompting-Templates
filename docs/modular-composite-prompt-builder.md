# Modular Composite Prompt Builder

The Modular Composite Prompt Builder is a prompt engineering workspace designed to let you build complex, multi-frame image generation prompts from reusable pieces.

## Features

1. **Dropdown Variable Builder**: Select modular pieces from structured prompt categories to compile a prompt instantly.
2. **Drag-and-Drop Sandbox**: Drag or add blocks from a variable bin into a live workspace where you can reorder, duplicate, disable, or customize block text.
3. **Consecutive vs. Concurrent Mode Toggle**: Control the temporal structure of the compiled output.
4. **Mode-Aware Compiler**: Filters incompatible blocks and formats positive and negative prompts properly.
5. **Saved Presets**: Pre-populated block combinations that fit specific visual styles.
6. **Multi-Format Export**: Copy positive/negative prompts, raw text, JSON configuration, or markdown cards.

---

## Accessing the Builder

To open the builder in your local environment:
1. Run `npm start` in the repository root.
2. Open `http://localhost:3000/modular-composite-builder.html` in your browser.
3. Alternatively, click the **Open Modular Composite Builder** link in the header of the main Cyber-Atlas dashboard.

---

## Interface Modes

### 1. Dropdown Variable Builder
Ideal for quick, guided prompt construction.
- Each select dropdown maps to a prompt category (e.g. Composition, Lighting, Style).
- Selecting an option updates the compiled prompt live.
- Selecting "Skip this category" excludes that block.

### 2. Drag Sandbox
Allows advanced modular construction like "prompt Lego".
- **Variable Bin**: Groups all available prompt blocks by category. Click any block to add it to the sandbox.
- **sandbox list**: Blocks in the sandbox can be:
  - Reordered vertically using the arrow buttons (↑/↓) to change their position in the compiled output.
  - Set as **Required** (always included), **Optional** (included by default), or **Disabled** (ignored by compiler).
  - Customized by typing directly into each block's textarea.
  - Duplicated or removed with a single click.

---

## Structural Logic Modes

The global toggle at the top of the header changes the temporal bridge language used in the compiled prompt.

### Consecutive Mode
Use this mode when you want frames to represent a chronological sequence (e.g., film sequences, storyboards, before/after comparisons).
- **Bridge Language**: Uses chronological phrasing like:
  - `Frame 1 begins the visual action, Frame 2 continues it, and Frame 3 concludes...`
  - `then`, `next`, `afterward`, `later in the sequence`

### Concurrent Mode
Use this mode when all frames represent the **exact same instant** captured simultaneously from different vantages (e.g. front/side/rear reference sheets, multi-camera views, surveillance arrays).
- **Bridge Language**: Emphasizes that time is frozen:
  - `at the same instant`, `simultaneously`, `same moment`, `from separate vantages`
- **Chronological Filtering**: The compiler automatically removes and replaces timeline progression words like `then`, `next`, `afterward`, `concludes`, or `later` to prevent the AI model from introducing sequential motion.

---

## Presets

The builder includes 4 starter presets:
1. **Cinematic 3-frame film stills** (Consecutive): Chronological sequence.
2. **Same-moment concurrent triptych** (Concurrent): Three vantages of one frozen instant.
3. **Noir atmosphere conversion** (Consecutive): Moody noir cinematography.
4. **Front / side / rear technical reference** (Concurrent): Same-moment reference sheet.

---

## Exporting & Copying

- **Copy Full**: Copies the positive and negative prompts merged together.
- **Copy Positive**: Copies the positive prompt text.
- **Copy Negative**: Copies the negative instructions.
- **Copy JSON Configuration**: Exports the selected state and block options as a JSON config.
- **Copy Markdown Prompt Card**: Exports a clean markdown presentation card of the prompt.

---

## Technical Details

The React component is built using standard React Hooks (`useMemo`, `useState`) and bundled using `esbuild` into:
- `dist/modularCompositePromptBuilder.js`

To compile typescript and re-bundle the script, run:
```bash
npm run build
```

To run Jest tests verifying compiler behavior, run:
```bash
npm test
```
