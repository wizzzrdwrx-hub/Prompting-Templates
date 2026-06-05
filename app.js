/**
 * Cyber-Atlas App Controller
 * Dual-System (Biological / Mechanical) Internal Synthesis Engine
 */

const PRESETS = [
  {
    id: "nautilus",
    title: "Chambered Nautilus Shell",
    domain: "biological",
    desc: "Volumetric chambered structure detailing evolutionary growth logarithmic spirals.",
    params: {
      subjectType: "biological",
      subjectInput: "chambered nautilus shell",
      sourceUse: "Ignore the original environment and use only the main subject as reference. Rebuild the result as a clean studio or educational internal-view study.",
      visualMode: "cutaway illustration",
      detailFocus: "Show layered subsystems clearly, separating structural, functional, and support components so each layer is easy to read.",
      domainSpecific: "Use a biologically accurate treatment for living subjects, with anatomically coherent bones, organs, tissues, or vascular structures. For mechanical subjects, translate that same rigor into engineering-accurate parts, housings, fasteners, and internal mechanisms.",
      backgroundStyle: "Minimal museum-display background with generous negative space and no visible environment.",
      lightingStyle: "Use luminous internal highlighting, crisp edges, and subtle layered translucency so the internal structures are easy to read.",
      compositionStyle: "Use a poster-style layout with a strong hero subject and enough empty space for a clean educational feel.",
      paletteStyle: "Use black, cyan, blue, teal, and luminous white if the visualization is radiographic or futuristic.",
      moodStyle: "scientific, refined, clear, and informative",
      extraNotes: "Expose internal chamber septa and siphuncle tubes. Add elegant faint cross-sectional grids."
    }
  },
  {
    id: "watch",
    title: "Vanguard Chronograph Movement",
    domain: "mechanical",
    desc: "Exploded micro-gear assemblies, escapement wheels, and balance springs of a pocket watch.",
    params: {
      subjectType: "mechanical",
      subjectInput: "luxury automatic chronograph wristwatch",
      sourceUse: "Use the uploaded image only as loose inspiration for silhouette and composition. The final visualization may become cleaner, more symmetrical, and more diagrammatic.",
      visualMode: "exploded-view diagram",
      detailFocus: "Show all major components in organized assembly order so the viewer can understand how the system goes together.",
      domainSpecific: "Use a biologically accurate treatment for living subjects, with anatomically coherent bones, organs, tissues, or vascular structures. For mechanical subjects, translate that same rigor into engineering-accurate parts, housings, fasteners, and internal mechanisms.",
      backgroundStyle: "Technical blueprint-style background with restrained visual texture and a clean presentation.",
      lightingStyle: "Use neutral technical rendering with crisp surfaces and clear section lines, like a premium educational or engineering illustration.",
      compositionStyle: "Use a diagrammatic composition with the subject isolated and arranged for maximum readability rather than dramatic effect.",
      paletteStyle: "Use blueprint white-on-blue tones if the presentation leans schematic or engineering-oriented.",
      moodStyle: "technical, precise, and instructional",
      extraNotes: "Detail small rubies, escapements, hairspring gears, and engraved brass baseplates. Explode components vertically."
    }
  },
  {
    id: "heart",
    title: "Steam-Clockwork Valve Heart",
    domain: "biological",
    desc: "A stunning hybrid heart study depicting biological ventricles operating with brass clockwork valves.",
    params: {
      subjectType: "biological",
      subjectInput: "human heart hybrid with miniature steam pipes and clockwork valves",
      sourceUse: "Use the uploaded image as a strict composition reference. Preserve body or object angle, gesture, and scale while replacing the original environment with a minimal technical or clinical background.",
      visualMode: "transparent-shell visualization",
      detailFocus: "Prioritize organs, soft-tissue systems, fluid pathways, power paths, or process flow, making the internal operation clearly visible.",
      domainSpecific: "Use a biologically accurate treatment for living subjects, with anatomically coherent bones, organs, tissues, or vascular structures. For mechanical subjects, translate that same rigor into engineering-accurate parts, housings, fasteners, and internal mechanisms.",
      backgroundStyle: "Dark black or near-black background. Remove the original environment entirely. No scenery, props, clutter, labels, or distractions.",
      lightingStyle: "Use polished editorial lighting with strong contrast, clean surface separation, and premium print-quality clarity.",
      compositionStyle: "Use a premium product-style composition, isolated in frame, clean and precise, with no clutter.",
      paletteStyle: "Use restrained naturalistic tones if the visualization is educational, anatomical, or mechanical cutaway based.",
      moodStyle: "museum-quality, elegant, and quietly dramatic",
      extraNotes: "Show a glowing core inside the heart. Glass outer casing showing internal mechanical-biological pumps in beautiful amber light."
    }
  },
  {
    id: "jet",
    title: "Turbofan Aircraft Jet Engine",
    domain: "mechanical",
    desc: "Layered CAD section showing compressor fans, combustor chambers, and extreme volumetric exhaust.",
    params: {
      subjectType: "mechanical",
      subjectInput: "high-bypass turbofan aircraft jet engine",
      sourceUse: "Ignore the original environment and use only the main subject as reference. Rebuild the result as a clean studio or educational internal-view study.",
      visualMode: "CAD-style section render",
      detailFocus: "Show layered subsystems clearly, separating structural, functional, and support components so each layer is easy to read.",
      domainSpecific: "Use a biologically accurate treatment for living subjects, with anatomically coherent bones, organs, tissues, or vascular structures. For mechanical subjects, translate that same rigor into engineering-accurate parts, housings, fasteners, and internal mechanisms.",
      backgroundStyle: "Clinical scan background with no scenery and a quiet, diagnostic presentation.",
      lightingStyle: "Use CAD-style realism with precise geometry, subtle material definition, and clean section cuts.",
      compositionStyle: "Use a full-subject composition, centered in frame, with clear visibility of the internal structures and balanced negative space.",
      paletteStyle: "Use clean editorial colors with controlled contrast and premium publication aesthetics.",
      moodStyle: "editorial, premium, and visually compelling",
      extraNotes: "Cross section through combustion turbine exposing volumetric glowing red ignitions and complex titanium blade meshes."
    }
  }
];

class CyberAtlasApp {
  constructor() {
    this.state = {
      activeTab: 'render',
      activeRightTab: 'presets',
      isGenerating: false,
      zoomScale: 1.0,
      panOffset: { x: 0, y: 0 },
      isPanning: false,
      startPan: { x: 0, y: 0 },
      magnifierActive: false,
      sourceImage: null,
      history: [],
      compareImages: [],
      currentGeneratedUrl: '',
      settings: {
        engine: 'pollinations',
        apiKey: '',
        resolution: '1024x1024'
      },
      // New Magic Layers state tracking
      layers: {
        shell: { opacity: 1.0, visible: true },
        skeleton: { opacity: 0.0, visible: true },
        process: { opacity: 0.0, visible: true },
        telemetry: { opacity: 0.0, visible: true }
      }
    };

    this.fields = [
      "subjectType",
      "subjectInput",
      "sourceUse",
      "visualMode",
      "detailFocus",
      "domainSpecific",
      "backgroundStyle",
      "lightingStyle",
      "compositionStyle",
      "paletteStyle",
      "moodStyle",
      "extraNotes"
    ];

    this.initElements();
    this.loadState();
    this.initEventListeners();
    this.renderPresets();
    this.renderHistory();
    this.buildPrompt();
  }

  initElements() {
    // Buttons
    this.generateBtn = document.getElementById("generateVisualBtn");
    this.copyBtn = document.getElementById("copyPromptBtn");
    this.resetBtn = document.getElementById("resetFormBtn");
    this.openSettingsBtn = document.getElementById("openSettingsBtn");
    this.closeSettingsBtn = document.getElementById("closeSettingsBtn");
    this.saveSettingsBtn = document.getElementById("saveSettingsBtn");
    this.clearKeysBtn = document.getElementById("clearKeysBtn");

    // Form inputs
    this.inputs = {};
    this.fields.forEach(id => {
      this.inputs[id] = document.getElementById(id);
    });

    // Canvas Tabs
    this.tabs = {
      render: document.getElementById("tabRender"),
      upload: document.getElementById("tabUpload"),
      compare: document.getElementById("tabCompare")
    };
    
    // Panel Tabs
    this.presetsTabBtn = document.getElementById("tabPresets");
    this.historyTabBtn = document.getElementById("tabHistory");
    this.presetsPane = document.getElementById("tabPresetsPane");
    this.historyPane = document.getElementById("tabHistoryPane");

    // Canvas Components
    this.viewportMain = document.getElementById("viewportMain");
    this.renderImage = document.getElementById("layerBase"); // Map renderImage to layerBase for backward compatibility
    this.renderEmptyState = document.getElementById("renderEmptyState");
    this.scannerOverlay = document.getElementById("scannerOverlay");
    this.scannerLogPanel = document.getElementById("scannerLogPanel");
    this.scanMagnifier = document.getElementById("scanMagnifier");
    this.scanMagnifierLens = document.getElementById("scanMagnifierLens");
    
    // Magic Layers stacked components
    this.layerDeck = document.getElementById("layerDeck");
    this.layerBase = document.getElementById("layerBase");
    this.layerSkeleton = document.getElementById("layerSkeleton");
    this.layerProcess = document.getElementById("layerProcess");
    this.layerTelemetry = document.getElementById("layerTelemetry");
    
    this.layersDrawerToggleBtn = document.getElementById("layersDrawerToggleBtn");
    this.layersControlPanel = document.getElementById("layersControlPanel");
    this.layersCollapseBtn = document.getElementById("layersCollapseBtn");
    
    // Upload Zone
    this.sourceUploadContainer = document.getElementById("sourceUploadContainer");
    this.sourceImageFileInput = document.getElementById("sourceImageFileInput");
    this.sourcePreviewImage = document.getElementById("sourcePreviewImage");

    // Compare
    this.compareContainer = document.getElementById("compareContainer");
    this.compareEmptyState = document.getElementById("compareEmptyState");
    this.compareImgLeft = document.getElementById("compareImgLeft");
    this.compareImgRight = document.getElementById("compareImgRight");
    this.compareOverlayWrapper = document.getElementById("compareOverlayWrapper");
    this.compareSliderHandle = document.getElementById("compareSliderHandle");

    // Canvas Toolbar
    this.toggleLensBtn = document.getElementById("toggleLensBtn");
    this.zoomInBtn = document.getElementById("zoomInBtn");
    this.zoomOutBtn = document.getElementById("zoomOutBtn");
    this.zoomResetBtn = document.getElementById("zoomResetBtn");
    this.exportPlateBtn = document.getElementById("exportPlateBtn");
    this.renderCanvasActions = document.getElementById("renderCanvasActions");

    // Prompt Chips Board
    this.promptChipsBoard = document.getElementById("promptChipsBoard");
    this.promptWordCounter = document.getElementById("promptWordCounter");
    
    // Telemetry Labels
    this.activeEngineLabel = document.getElementById("activeEngineLabel");
    this.historyCounterLabel = document.getElementById("historyCounterLabel");
    this.charCounterLabel = document.getElementById("charCounterLabel");

    // Drawer / Modals
    this.settingsDrawer = document.getElementById("settingsDrawer");
    this.settingsEngineSelect = document.getElementById("settingsEngineSelect");
    this.settingsApiKeyInput = document.getElementById("settingsApiKeyInput");
    this.settingsResolutionSelect = document.getElementById("settingsResolutionSelect");
    this.settingsApiKeyHelper = document.getElementById("settingsApiKeyHelper");

    // Toast
    this.toastContainer = document.getElementById("toastContainer");
    this.toastMessage = document.getElementById("toastMessage");
  }

  loadState() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('cyberatlas_settings');
    if (savedSettings) {
      this.state.settings = { ...this.state.settings, ...JSON.parse(savedSettings) };
    }
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem('cyberatlas_history');
    if (savedHistory) {
      this.state.history = JSON.parse(savedHistory);
    }

    // Apply settings values to form drawer
    this.settingsEngineSelect.value = this.state.settings.engine;
    this.settingsApiKeyInput.value = this.state.settings.apiKey;
    this.settingsResolutionSelect.value = this.state.settings.resolution;
    this.updateEngineLabels();
  }

  saveSettings() {
    this.state.settings.engine = this.settingsEngineSelect.value;
    this.state.settings.apiKey = this.settingsApiKeyInput.value;
    this.state.settings.resolution = this.settingsResolutionSelect.value;

    localStorage.setItem('cyberatlas_settings', JSON.stringify(this.state.settings));
    this.updateEngineLabels();
    this.buildPrompt();
    this.showToast("Telemetry configuration saved successfully.");
  }

  updateEngineLabels() {
    const engineName = this.state.settings.engine.toUpperCase();
    this.activeEngineLabel.textContent = engineName;
    
    if (this.state.settings.engine === 'pollinations') {
      this.settingsApiKeyHelper.textContent = "Pollinations.ai is 100% free and requires no key.";
      this.settingsApiKeyInput.disabled = true;
      this.settingsApiKeyInput.value = '';
    } else if (this.state.settings.engine === 'huggingface') {
      this.settingsApiKeyHelper.textContent = "Hugging Face requires a serverless user access token (HF_TOKEN).";
      this.settingsApiKeyInput.disabled = false;
    } else if (this.state.settings.engine === 'openai') {
      this.settingsApiKeyHelper.textContent = "OpenAI DALL-E 3 requires your personal secret API Key (sk-...).";
      this.settingsApiKeyInput.disabled = false;
    } else if (this.state.settings.engine === 'fal') {
      this.settingsApiKeyHelper.textContent = "Fal.ai requires a Fal client key (FAL_KEY).";
      this.settingsApiKeyInput.disabled = false;
    }
  }

  initEventListeners() {
    // Core Field Events
    this.fields.forEach(id => {
      this.inputs[id].addEventListener("change", () => {
        // Dynamic defaults for subject
        if (id === 'subjectType') {
          const type = this.inputs.subjectType.value;
          const currentSub = this.inputs.subjectInput.value;
          if (currentSub === 'full human body' || currentSub === 'mechanical assembly') {
            this.inputs.subjectInput.value = type === 'biological' ? 'full human body' : 'mechanical assembly';
          }
        }
        this.buildPrompt();
      });
      
      this.inputs[id].addEventListener("input", () => this.buildPrompt());
    });

    // Form Action Buttons
    this.generateBtn.addEventListener("click", () => this.triggerGeneration());
    this.copyBtn.addEventListener("click", () => this.copyPromptToClipboard());
    this.resetBtn.addEventListener("click", () => this.resetConfigForm());

    // Canvas tab listeners
    Object.keys(this.tabs).forEach(tabKey => {
      this.tabs[tabKey].addEventListener("click", () => this.switchCanvasTab(tabKey));
    });

    // Sidebar panels switching
    this.presetsTabBtn.addEventListener("click", () => this.switchSidebarTab('presets'));
    this.historyTabBtn.addEventListener("click", () => this.switchSidebarTab('history'));

    // Settings drawer trigger cogs
    this.openSettingsBtn.addEventListener("click", () => this.settingsDrawer.classList.add("open"));
    this.closeSettingsBtn.addEventListener("click", () => this.settingsDrawer.classList.remove("open"));
    this.settingsEngineSelect.addEventListener("change", () => this.updateEngineLabels());
    this.saveSettingsBtn.addEventListener("click", () => {
      this.saveSettings();
      this.settingsDrawer.classList.remove("open");
    });
    this.clearKeysBtn.addEventListener("click", () => {
      this.settingsApiKeyInput.value = '';
      this.state.settings.apiKey = '';
      localStorage.setItem('cyberatlas_settings', JSON.stringify(this.state.settings));
      this.showToast("Saved API key cache cleared.");
    });

    // Zoom/Pan Canvas interaction listeners
    this.zoomInBtn.addEventListener("click", () => this.adjustZoom(0.2));
    this.zoomOutBtn.addEventListener("click", () => this.adjustZoom(-0.2));
    this.zoomResetBtn.addEventListener("click", () => this.resetZoomAndPan());
    
    // Lens magnifying x-ray overlay toggle
    this.toggleLensBtn.addEventListener("click", () => this.toggleMagnifier());
    
    // Magic Layers control drawer toggles
    this.layersDrawerToggleBtn.addEventListener("click", () => {
      this.layersControlPanel.classList.toggle("collapsed");
    });
    this.layersCollapseBtn.addEventListener("click", () => {
      this.layersControlPanel.classList.add("collapsed");
    });

    // Magic Layers slider and visibility bindings
    ['shell', 'skeleton', 'process', 'telemetry'].forEach(layer => {
      const slider = document.getElementById(`slider_${layer}`);
      const label = document.getElementById(`opcLabel_${layer}`);
      
      slider.addEventListener("input", (e) => {
        const val = e.target.value;
        this.state.layers[layer].opacity = val / 100;
        label.textContent = `OPC: ${val}%`;
        this.applyLayerStyles();
      });
      
      const visBtn = document.querySelector(`.layer-vis-btn[data-layer="${layer}"]`);
      visBtn.addEventListener("click", () => {
        this.state.layers[layer].visible = !this.state.layers[layer].visible;
        visBtn.classList.toggle("active");
        
        const svg = visBtn.querySelector("svg");
        if (this.state.layers[layer].visible) {
          svg.style.opacity = "1";
          visBtn.style.color = "var(--accent-cyan)";
        } else {
          svg.style.opacity = "0.3";
          visBtn.style.color = "var(--text-muted)";
        }
        this.applyLayerStyles();
      });
    });
    
    // Textbook exporter canvas plate compiler
    this.exportPlateBtn.addEventListener("click", () => this.compileTextbookPlate());

    // Upload files Zone events
    this.sourceUploadContainer.addEventListener("click", () => this.sourceImageFileInput.click());
    this.sourceImageFileInput.addEventListener("change", (e) => this.handleGuidanceImageUpload(e));
    
    // Drag/drop guidance reference image
    this.sourceUploadContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.sourceUploadContainer.style.borderColor = "var(--accent-cyan)";
      this.sourceUploadContainer.style.background = "var(--accent-cyan-glow)";
    });
    this.sourceUploadContainer.addEventListener("dragleave", () => {
      this.sourceUploadContainer.style.borderColor = "var(--border-subtle)";
      this.sourceUploadContainer.style.background = "transparent";
    });
    this.sourceUploadContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      this.sourceUploadContainer.style.borderColor = "var(--border-subtle)";
      this.sourceUploadContainer.style.background = "transparent";
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processImageFile(file);
      }
    });

    // Canvas panning mouse/touch events
    this.renderImage.addEventListener("mousedown", (e) => this.startPanningHandler(e));
    window.addEventListener("mousemove", (e) => this.panMoveHandler(e));
    window.addEventListener("mouseup", () => this.stopPanningHandler());

    // Magnifier mouse move tracking
    this.renderImage.addEventListener("mousemove", (e) => this.trackMagnifierLens(e));
    this.renderImage.addEventListener("mouseleave", () => {
      this.scanMagnifier.style.display = "none";
    });

    // Compare Slider drag handle mouse/touch events
    this.compareSliderHandle.addEventListener("mousedown", (e) => this.startCompareSliderDrag(e));
    window.addEventListener("mousemove", (e) => this.compareSliderDragMove(e));
    window.addEventListener("mouseup", () => this.stopCompareSliderDrag());

    // Close settings drawer on background click
    this.settingsDrawer.addEventListener("click", (e) => {
      if (e.target === this.settingsDrawer) {
        this.settingsDrawer.classList.remove("open");
      }
    });
  }

  // --- TAB PANELS ROUTING ---
  switchCanvasTab(tabName) {
    Object.keys(this.tabs).forEach(k => {
      this.tabs[k].classList.remove("active");
      document.getElementById(`${k}Tab`).style.display = "none";
    });
    
    this.tabs[tabName].classList.add("active");
    document.getElementById(`${tabName}Tab`).style.display = "flex";
    this.state.activeTab = tabName;

    // Show/Hide toolbar action utilities depending on tab
    if (tabName === 'render') {
      this.renderCanvasActions.style.display = "flex";
    } else {
      this.renderCanvasActions.style.display = "none";
    }
  }

  switchSidebarTab(tabName) {
    this.presetsTabBtn.classList.remove("active");
    this.historyTabBtn.classList.remove("active");
    this.presetsPane.style.display = "none";
    this.historyPane.style.display = "none";

    if (tabName === 'presets') {
      this.presetsTabBtn.classList.add("active");
      this.presetsPane.style.display = "flex";
    } else {
      this.historyTabBtn.classList.add("active");
      this.historyPane.style.display = "flex";
    }
    this.state.activeRightTab = tabName;
  }

  // --- PROMPT COMPILING & DYNAMIC CHIPS ---
  getNegativePromptText() {
    const subjectType = this.inputs.subjectType.value || "biological";
    const visualMode = this.inputs.visualMode.value || "cutaway illustration";
    
    const typePrompt = subjectType === "biological"
      ? "No gore, no blood, no exposed flesh, no horror, no injury, no extra limbs, no missing anatomy, no deformed anatomy, no parasites, no grotesque body horror."
      : "No broken parts unless requested, no impossible mechanisms, no floating unrelated components, no warped geometry, no unrealistic assembly logic, no random extra parts.";

    const modePrompt = visualMode.includes("exploded")
      ? " Keep the exploded spacing organized and assembly logic clear."
      : "";

    return `${typePrompt} No cluttered background, no random scenery, no sloppy labels, no unreadable text, no cartoon style, no messy glow effects, no opaque exterior blocking the internal structures.${modePrompt}`;
  }

  buildPrompt() {
    const subjectType = this.inputs.subjectType.value;
    const subject = this.inputs.subjectInput.value.trim() || (subjectType === "biological" ? "full human body" : "mechanical assembly");
    const extra = this.inputs.extraNotes.value.trim();
    const visualMode = this.inputs.visualMode.value;
    
    const typeSentence = subjectType === "biological"
      ? `A ${subject} rendered as a ${visualMode}, showing the internal biological structures in a clear, accurate, and visually compelling way.`
      : `A ${subject} rendered as a ${visualMode}, showing the internal mechanical components and system relationships in a clear, accurate, and visually compelling way.`;

    const detailFocus = this.inputs.detailFocus.value;
    const domainSpecific = this.inputs.domainSpecific.value;
    const lightingStyle = this.inputs.lightingStyle.value;
    const backgroundStyle = this.inputs.backgroundStyle.value;
    const compositionStyle = this.inputs.compositionStyle.value;
    const paletteStyle = this.inputs.paletteStyle.value;
    const moodStyle = this.inputs.moodStyle.value;

    const compiledMainPrompt = `Create a ${visualMode} of ${subject}. ${detailFocus} ${domainSpecific} ${lightingStyle} ${backgroundStyle} ${compositionStyle} ${paletteStyle} The final result should feel ${moodStyle}.`;
    
    const styleNotes = `Make the visualization educational, coherent, and internally believable for the subject. Prioritize clarity, legibility, and strong visual hierarchy over unnecessary visual chaos.`;
    
    const negativePrompt = this.getNegativePromptText();

    // The full raw prompt exported
    const fullTextPrompt = `TITLE:\nInternal Visualization Prompt Generator Output\n\nSOURCE IMAGE USE:\n${this.inputs.sourceUse.value}\n\nSUBJECT TYPE:\n${subjectType}\n\nSUBJECT:\n${typeSentence}\n\nMAIN PROMPT:\n${compiledMainPrompt}\n\nSTYLE NOTES:\n${styleNotes}\n\n${extra ? `EXTRA NOTES:\n${extra}\n\n` : ""}NEGATIVE PROMPT:\n${negativePrompt}`;

    // Update telemetry header stats
    this.charCounterLabel.textContent = `${fullTextPrompt.length} CHARS`;
    const wordCount = fullTextPrompt.split(/\s+/).filter(Boolean).length;
    this.promptWordCounter.textContent = `${wordCount} WORDS`;

    // Render interactive chip board!
    this.renderPromptChips(subject, visualMode, detailFocus, backgroundStyle, moodStyle, extra);

    return {
      fullText: fullTextPrompt,
      mainOnly: compiledMainPrompt,
      subject,
      visualMode,
      negativePrompt,
      fullTitle: `${subject} (${visualMode})`
    };
  }

  renderPromptChips(subject, visualMode, detailFocus, backgroundStyle, moodStyle, extra) {
    this.promptChipsBoard.innerHTML = '';

    const addText = (txt) => {
      const span = document.createElement("span");
      span.className = "prompt-chip chip-standard";
      span.textContent = txt;
      this.promptChipsBoard.appendChild(span);
    };

    const addInteractiveChip = (text, targetId, chipTypeClass) => {
      const chip = document.createElement("span");
      chip.className = `prompt-chip ${chipTypeClass}`;
      chip.setAttribute("data-ref", targetId);
      
      const txtSpan = document.createElement("span");
      txtSpan.className = "prompt-chip-text";
      txtSpan.textContent = text;
      
      chip.appendChild(txtSpan);
      
      // Highlight matching input sidebar group on hover
      chip.addEventListener("mouseenter", () => {
        const group = document.querySelector(`.control-group[data-ref="${targetId}"]`);
        if (group) group.classList.add("active");
        chip.classList.add("active");
      });
      
      chip.addEventListener("mouseleave", () => {
        const group = document.querySelector(`.control-group[data-ref="${targetId}"]`);
        if (group) group.classList.remove("active");
        chip.classList.remove("active");
      });

      // Quick scroll and focus element on click
      chip.addEventListener("click", () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
          // Flash effect
          const group = document.querySelector(`.control-group[data-ref="${targetId}"]`);
          if (group) {
            group.style.transform = "scale(1.03)";
            setTimeout(() => group.style.transform = "scale(1)", 200);
          }
        }
      });

      this.promptChipsBoard.appendChild(chip);
    };

    // Construct the text sentences as chips
    addText("Synthesize a");
    addInteractiveChip(visualMode.replace(" style visualization", "").replace(" illustration", "").replace(" study", ""), "visualMode", "chip-mode");
    addText("exposing the internal architecture of the");
    addInteractiveChip(subject, "subjectInput", "chip-subject");
    addText(".");
    
    // Split detailing
    addText("For clarity,");
    addInteractiveChip("emphasize " + detailFocus.split(",")[0].replace("Show the ", "").replace("Prioritize ", ""), "detailFocus", "chip-detail");
    addText("situated against an");
    
    // Background
    const bgShort = backgroundStyle.split(".")[0];
    addInteractiveChip(bgShort, "backgroundStyle", "chip-bg");
    addText(".");
    
    addText("The diagnostic aura must portray as");
    addInteractiveChip(moodStyle, "moodStyle", "chip-detail");
    addText(".");

    if (extra) {
      addText("Anomalous injections parsed:");
      addInteractiveChip(`"${extra}"`, "extraNotes", "chip-subject");
    }
  }

  // --- DYNAMIC PRESETS DECK ---
  renderPresets() {
    this.presetsPane.innerHTML = '';
    
    PRESETS.forEach(p => {
      const card = document.createElement("article");
      card.className = `preset-card ${p.domain}`;
      card.innerHTML = `
        <div class="preset-card-header">
          <h3 class="preset-title">${p.title}</h3>
          <span class="preset-tag">${p.domain}</span>
        </div>
        <p class="preset-desc">${p.desc}</p>
      `;

      card.addEventListener("click", () => {
        this.loadPreset(p);
      });

      this.presetsPane.appendChild(card);
    });
  }

  loadPreset(preset) {
    this.fields.forEach(id => {
      if (preset.params[id] !== undefined) {
        this.inputs[id].value = preset.params[id];
      }
    });

    this.buildPrompt();
    this.switchCanvasTab('render');
    this.showToast(`Active template loaded: ${preset.title}`);
  }

  // --- DYNAMIC IMAGE GENERATION ---
  async triggerGeneration() {
    if (this.state.isGenerating) return;
    
    const promptInfo = this.buildPrompt();
    const engine = this.state.settings.engine;
    const key = this.state.settings.apiKey;

    this.state.isGenerating = true;
    this.generateBtn.disabled = true;
    this.generateBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tel-item" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      SYNTHESIZING...
    `;

    // Initialize telemetry sweeping simulator
    this.renderEmptyState.style.display = "none";
    this.renderImage.style.display = "none";
    this.scannerOverlay.style.display = "flex";
    this.scannerLogPanel.innerHTML = '';
    
    this.logTelemetry("Initializing synthesis diagnostics sweeper...");
    await this.sleep(350);
    this.logTelemetry(`Assembling prompt instructions: "${promptInfo.fullTitle}"`);
    await this.sleep(300);
    this.logTelemetry(`Routing request via synthesis node: [${engine.toUpperCase()}]`);

    let targetImageUrl = '';
    const seed = Math.floor(Math.random() * 9999999);
    
    try {
      if (engine === 'pollinations') {
        this.logTelemetry("Parsing structural layer guidance parameters...");
        await this.sleep(250);
        this.logTelemetry("Transmitting coordinate tensors to pollinations engine...");
        
        // Compile a clean generation prompt. Pollinations handles long prompts. Add style modifiers.
        const cleanPrompt = `${promptInfo.mainOnly} style of highly detailed educational scientific plate, x-ray, cutaway, clean composition, dark background, 8k resolution, volumetric rendering.`;
        const encodedPrompt = encodeURIComponent(cleanPrompt);
        
        // Pollinations.ai free GET generation endpoint
        targetImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&private=true&enhance=false`;
        
        this.logTelemetry("Connecting socket. Preloading generated pixel buffer...");
      } 
      else if (engine === 'huggingface') {
        if (!key) {
          throw new Error("Missing Hugging Face Token in engine configurations drawer.");
        }
        this.logTelemetry("Contacting Hugging Face serverless gateway...");
        await this.sleep(300);
        
        // Hugging Face standard serverless inference API
        const cleanPrompt = `${promptInfo.mainOnly} volumetric technical cutaway anatomical drawing, scientific Textbook Plate.`;
        const response = await fetch(
          "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
          {
            headers: { Authorization: `Bearer ${key}` },
            method: "POST",
            body: JSON.stringify({ inputs: cleanPrompt }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`HF Gateway responded with status: ${response.status}`);
        }
        
        const blob = await response.blob();
        targetImageUrl = URL.createObjectURL(blob);
      } 
      else if (engine === 'openai') {
        if (!key) {
          throw new Error("Missing OpenAI API Key in engine configurations drawer.");
        }
        this.logTelemetry("Authorizing handshake with OpenAI DALL-E Gateway...");
        await this.sleep(400);
        
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `${promptInfo.mainOnly} Premium anatomical cutaway/X-ray diagram. High fidelity textbook plate style. Centered framing, pure black background, hyper-detailed structure.`,
            n: 1,
            size: "1024x1024",
            response_format: "url"
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || "DALL-E 3 authentication failed.");
        }

        const data = await response.json();
        targetImageUrl = data.data[0].url;
      } 
      else if (engine === 'fal') {
        if (!key) {
          throw new Error("Missing Fal.ai Client Secret Key in configurations drawer.");
        }
        this.logTelemetry("Contacting Fal.ai high-speed queue node...");
        await this.sleep(400);

        const response = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${key}`
          },
          body: JSON.stringify({
            prompt: promptInfo.mainOnly,
            image_size: "square_hd",
            num_inference_steps: 4,
            sync_mode: true
          })
        });

        if (!response.ok) {
          throw new Error(`Fal.ai Queue error: ${response.statusText}`);
        }

        const data = await response.json();
        targetImageUrl = data.images[0].url;
      }

      // Preload image in memory to ensure smooth canvas showing
      this.logTelemetry("Buffering visual tensors. Pre-calculating layer scales...");
      await this.sleep(300);
      
      const preloadedImg = new Image();
      preloadedImg.crossOrigin = "anonymous";
      
      preloadedImg.onload = () => {
        // Complete sweep simulation
        this.logTelemetry("[OK] Layer buffers consolidated successfully.");
        this.logTelemetry("[OK] Synthesis complete. Mounting viewport...");
        
        setTimeout(() => {
          this.scannerOverlay.style.display = "none";
          
          // Load preloaded targetImageUrl into layer stack
          this.layerBase.src = targetImageUrl;
          this.layerSkeleton.src = targetImageUrl;
          this.layerProcess.src = targetImageUrl;
          
          this.layerDeck.style.display = "flex";
          this.layersDrawerToggleBtn.style.display = "flex";
          this.layersControlPanel.style.display = "flex";
          
          // Sensibly dial in layer opacities depending on Visual Mode
          this.resetLayerControls(promptInfo.visualMode);
          this.resetZoomAndPan();
          
          // Add this generation successfully to archives
          this.addHistoryCard(promptInfo.subject, promptInfo.visualMode, targetImageUrl, promptInfo.fullText);
          this.state.currentGeneratedUrl = targetImageUrl;
          
          this.state.isGenerating = false;
          this.generateBtn.disabled = false;
          this.generateBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"/><path d="M12 2v10"/><path d="m9 9 3 3 3-3"/><circle cx="12" cy="12" r="10"/></svg>
            GENERATE VISUAL
          `;
          
          this.showToast("Visual synthesized successfully.");
        }, 600);
      };

      preloadedImg.onerror = () => {
        throw new Error("Preloading pixel buffers failed. Server connection unstable.");
      };

      preloadedImg.src = targetImageUrl;

    } catch (err) {
      this.logTelemetry(`[ERROR] ${err.message}`);
      this.showToast(`Generation Failed: ${err.message}`, true);
      
      setTimeout(() => {
        this.scannerOverlay.style.display = "none";
        this.renderEmptyState.style.display = "flex";
        this.state.isGenerating = false;
        this.generateBtn.disabled = false;
        this.generateBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"/><path d="M12 2v10"/><path d="m9 9 3 3 3-3"/><circle cx="12" cy="12" r="10"/></svg>
          GENERATE VISUAL
        `;
      }, 1500);
    }
  }

  logTelemetry(msg) {
    const time = new Date().toLocaleTimeString().split(' ')[0];
    const logLine = document.createElement("div");
    logLine.className = "scanner-log-line";
    
    const isOk = msg.startsWith("[OK]");
    const isErr = msg.startsWith("[ERROR]");
    
    let cleanMsg = msg;
    let badge = `<span class="status-ok">[OK]</span>`;
    if (isOk) {
      cleanMsg = msg.replace("[OK] ", "");
    } else if (isErr) {
      cleanMsg = msg.replace("[ERROR] ", "");
      badge = `<span style="color:#ff4444;">[FAIL]</span>`;
    } else {
      badge = `<span style="color:var(--accent-cyan);">[INFO]</span>`;
    }

    logLine.innerHTML = `
      <span class="time">${time}</span>
      ${badge}
      <span>${cleanMsg}</span>
    `;
    this.scannerLogPanel.appendChild(logLine);
    this.scannerLogPanel.scrollTop = this.scannerLogPanel.scrollHeight;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- LOCAL HISTORY MANAGEMENT ---
  addHistoryCard(subject, visualMode, imageUrl, fullPrompt) {
    // Add to state arrays
    const newItem = {
      id: 'item_' + Date.now(),
      subject,
      visualMode,
      imageUrl,
      fullPrompt,
      timestamp: new Date().toLocaleString(),
      favorite: false
    };

    this.state.history.unshift(newItem);
    
    // Manage comparison buffers: push to compare queues
    this.state.compareImages.unshift(imageUrl);
    if (this.state.compareImages.length > 5) this.state.compareImages.pop();

    this.saveHistory();
    this.renderHistory();
    this.updateCompareViewports();
  }

  saveHistory() {
    localStorage.setItem('cyberatlas_history', JSON.stringify(this.state.history));
  }

  renderHistory() {
    const wrapper = document.getElementById("historyItemsWrapper");
    const emptyState = document.getElementById("historyEmptyState");
    
    this.historyCounterLabel.textContent = `${this.state.history.length} ITEMS`;

    if (this.state.history.length === 0) {
      emptyState.style.display = "flex";
      wrapper.innerHTML = '';
      return;
    }

    emptyState.style.display = "none";
    wrapper.innerHTML = '';

    this.state.history.forEach(item => {
      const card = document.createElement("article");
      card.className = "history-card";
      card.innerHTML = `
        <div class="history-card-img-wrapper">
          <img src="${item.imageUrl}" class="history-card-img" alt="Thumbnail archive preview">
        </div>
        <div class="history-card-content">
          <div class="history-card-title">${item.subject}</div>
          <div class="history-card-desc">${item.visualMode}</div>
          <div class="history-card-actions">
            <span class="history-card-date">${item.timestamp.split(',')[0]}</span>
            <div class="history-card-btns">
              <button class="history-mini-btn favorite ${item.favorite ? 'active' : ''}" title="Favorite/Bookmark item">★</button>
              <button class="history-mini-btn rehydrate" title="Restore this template configurations">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
              <button class="history-mini-btn delete" title="Delete from archives">×</button>
            </div>
          </div>
        </div>
      `;

      // Event handlers on history card buttons
      const favBtn = card.querySelector(".favorite");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        item.favorite = !item.favorite;
        favBtn.classList.toggle("active");
        this.saveHistory();
        this.showToast(item.favorite ? "Added item to favorites." : "Removed from favorites.");
      });

      const rehydrateBtn = card.querySelector(".rehydrate");
      rehydrateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.rehydrateFieldsFromPrompt(item.fullPrompt);
      });

      const delBtn = card.querySelector(".delete");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.state.history = this.state.history.filter(h => h.id !== item.id);
        this.saveHistory();
        this.renderHistory();
        this.updateCompareViewports();
        this.showToast("Archived visual item deleted.");
      });

      // Double click card triggers compare loader
      card.addEventListener("dblclick", () => {
        this.stageImageForCompare(item.imageUrl);
      });

      wrapper.appendChild(card);
    });
  }

  rehydrateFieldsFromPrompt(fullPrompt) {
    try {
      // Find matches in the prompt format
      const lines = fullPrompt.split('\n');
      
      const getSectionValue = (sectionName) => {
        const idx = lines.indexOf(sectionName);
        if (idx !== -1 && idx < lines.length - 1) {
          return lines[idx + 1];
        }
        return '';
      };

      const subjectType = getSectionValue("SUBJECT TYPE:");
      const sourceUse = getSectionValue("SOURCE IMAGE USE:");
      
      // Extract from MAIN PROMPT line
      const mainPromptIdx = lines.indexOf("MAIN PROMPT:");
      if (mainPromptIdx !== -1) {
        const mainLine = lines[mainPromptIdx + 1];
        
        // Subject input: match inside "Create a [mode] of [subject]."
        const visualModeText = this.inputs.visualMode.value; // fallback
        
        // Let's loop options to see which values match the string
        this.fields.forEach(id => {
          if (id === 'subjectType' && subjectType) {
            this.inputs.subjectType.value = subjectType.toLowerCase();
          } else if (id === 'sourceUse' && sourceUse) {
            // Find option containing or matching sourceUse
            for (let opt of this.inputs.sourceUse.options) {
              if (opt.value === sourceUse) {
                this.inputs.sourceUse.value = opt.value;
                break;
              }
            }
          } else {
            // Check dropdown options
            const dropdown = this.inputs[id];
            if (dropdown && dropdown.tagName === 'SELECT' && id !== 'subjectType' && id !== 'sourceUse') {
              for (let opt of dropdown.options) {
                if (mainLine.includes(opt.value)) {
                  dropdown.value = opt.value;
                  break;
                }
              }
            }
          }
        });

        // Subject text extracted
        const matchSubject = mainLine.match(/of ([^.]+)\./);
        if (matchSubject && matchSubject[1]) {
          this.inputs.subjectInput.value = matchSubject[1];
        }
      }

      // Notes
      const extraIdx = lines.indexOf("EXTRA NOTES:");
      if (extraIdx !== -1) {
        this.inputs.extraNotes.value = lines[extraIdx + 1];
      } else {
        this.inputs.extraNotes.value = '';
      }

      this.buildPrompt();
      this.showToast("Configuration parameters rehydrated from archive card.");
    } catch (err) {
      this.showToast("Failed to fully parse configuration prompt.", true);
    }
  }

  // --- SOURCE REFERENCE STUDIO ---
  handleGuidanceImageUpload(event) {
    const file = event.target.files[0];
    if (file) this.processImageFile(file);
  }

  processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.state.sourceImage = dataUrl;
      
      this.sourcePreviewImage.src = dataUrl;
      this.sourcePreviewImage.style.display = "block";
      this.sourceUploadContainer.style.display = "none";
      
      this.showToast("Reference pose guidance image loaded successfully.");
    };
    reader.readAsDataURL(file);
  }

  // --- ZOOM & PAN CANVAS INTERACTIONS ---
  adjustZoom(factor) {
    this.state.zoomScale = Math.max(0.5, Math.min(8.0, this.state.zoomScale + factor));
    this.applyCanvasTransform();
  }

  resetZoomAndPan() {
    this.state.zoomScale = 1.0;
    this.state.panOffset = { x: 0, y: 0 };
    this.applyCanvasTransform();
  }

  applyCanvasTransform() {
    this.layerDeck.style.transform = `scale(${this.state.zoomScale}) translate(${this.state.panOffset.x}px, ${this.state.panOffset.y}px)`;
  }

  startPanningHandler(e) {
    if (this.state.magnifierActive) return; // ignore panning when x-ray magnifier active
    e.preventDefault();
    this.state.isPanning = true;
    this.state.startPan = {
      x: e.clientX - this.state.panOffset.x * this.state.zoomScale,
      y: e.clientY - this.state.panOffset.y * this.state.zoomScale
    };
  }

  panMoveHandler(e) {
    if (!this.state.isPanning) return;
    
    // Calculate relative offsets
    const dx = e.clientX - this.state.startPan.x;
    const dy = e.clientY - this.state.startPan.y;
    
    this.state.panOffset = {
      x: dx / this.state.zoomScale,
      y: dy / this.state.zoomScale
    };
    
    this.applyCanvasTransform();
  }

  stopPanningHandler() {
    this.state.isPanning = false;
  }

  // --- INTERACTIVE MAGNIFIER / RADIOGRAPHIC SCAN LENS ---
  toggleMagnifier() {
    this.state.magnifierActive = !this.state.magnifierActive;
    this.toggleLensBtn.classList.toggle("active");
    this.resetZoomAndPan();
    
    if (this.state.magnifierActive) {
      this.renderImage.style.cursor = "none";
      this.showToast("Radiographic scanning lens enabled.");
    } else {
      this.renderImage.style.cursor = "grab";
      this.scanMagnifier.style.display = "none";
      this.showToast("Inspection magnifier disabled.");
    }
  }

  trackMagnifierLens(e) {
    if (!this.state.magnifierActive) return;

    this.scanMagnifier.style.display = "block";

    // Obtain bounding box of the render image
    const rect = this.renderImage.getBoundingClientRect();
    const viewPortRect = this.viewportMain.getBoundingClientRect();
    
    // Coordinates inside image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magnifier container relative position inside the viewport
    const mx = e.clientX - viewPortRect.left - 75;
    const my = e.clientY - viewPortRect.top - 75;

    this.scanMagnifier.style.left = `${mx}px`;
    this.scanMagnifier.style.top = `${my}px`;

    // Map magnified lens image background
    this.scanMagnifierLens.style.backgroundImage = `url('${this.renderImage.src}')`;
    
    // Position background scaled 2x
    const rx = (x / rect.width) * 100;
    const ry = (y / rect.height) * 100;
    this.scanMagnifierLens.style.backgroundPosition = `${rx}% ${ry}%`;
    this.scanMagnifierLens.style.backgroundSize = `${rect.width * 2}px ${rect.height * 2}px`;
  }

  // --- COMPARE SLIDER VIEWPORT ---
  stageImageForCompare(imageUrl) {
    if (this.state.compareImages.indexOf(imageUrl) === -1) {
      this.state.compareImages.unshift(imageUrl);
    }
    this.updateCompareViewports();
    this.switchCanvasTab('compare');
    this.showToast("Loaded image to comparison slider.");
  }

  updateCompareViewports() {
    const left = this.compareImgLeft;
    const right = this.compareImgRight;
    const count = this.state.compareImages.length;

    if (count < 2) {
      this.compareContainer.style.display = "none";
      this.compareEmptyState.style.display = "flex";
      return;
    }

    this.compareEmptyState.style.display = "none";
    this.compareContainer.style.display = "block";
    
    // Left holds previous image, Right holds latest
    left.src = this.state.compareImages[1];
    right.src = this.state.compareImages[0];
    
    // Default handles placement to middle
    this.compareOverlayWrapper.style.width = '50%';
    this.compareSliderHandle.style.left = '50%';
  }

  startCompareSliderDrag(e) {
    e.preventDefault();
    this.state.isDraggingCompare = true;
  }

  compareSliderDragMove(e) {
    if (!this.state.isDraggingCompare) return;

    const containerRect = this.compareContainer.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    
    // Compute percentage width
    let pct = (x / containerRect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    
    this.compareOverlayWrapper.style.width = `${pct}%`;
    this.compareSliderHandle.style.left = `${pct}%`;
  }

  stopCompareSliderDrag() {
    this.state.isDraggingCompare = false;
  }

  // --- TEXTBOOK PLATE PNG CANVAS COMPILER ---
  compileTextbookPlate() {
    if (!this.renderImage.src || this.renderImage.src.includes('empty')) {
      this.showToast("Synthesis plate compiler empty. Generate an image first.", true);
      return;
    }

    this.showToast("Compiling High-Fidelity anatomical textbooks plate...");

    const promptInfo = this.buildPrompt();

    // Create dynamic offscreen plate canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Standard high-res plate size (Ratio 3:4 portrait)
    canvas.width = 1200;
    canvas.height = 1600;

    // Draw textured blueprint grid background
    ctx.fillStyle = "#040712";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw structural blueprint grid lines
    ctx.strokeStyle = "rgba(0, 229, 255, 0.05)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Outer cybernetic technical border frame
    ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Corner crosshairs accents
    const drawCross = (cx, cy, len = 20) => {
      ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
      ctx.moveTo(cx, cy - len); ctx.lineTo(cx, cy + len);
      ctx.stroke();
    };
    drawCross(40, 40);
    drawCross(canvas.width - 40, 40);
    drawCross(40, canvas.height - 40);
    drawCross(canvas.width - 40, canvas.height - 40);

    // Plate Title Telemetry Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px 'Outfit', sans-serif";
    ctx.fillText("CYBER-ATLAS // SCHEMATIC DIAGNOSTIC VIEW", 60, 90);

    ctx.fillStyle = "var(--text-cyan, #5ce6ff)";
    ctx.font = "bold 16px 'Fira Code', monospace";
    ctx.fillText(`PLATE ID: CA-${Date.now().toString().slice(-6)} // ENGINE: ${this.state.settings.engine.toUpperCase()}`, 60, 125);

    // Dynamic horizontal line separator
    ctx.strokeStyle = "rgba(0, 229, 255, 0.25)";
    ctx.beginPath();
    ctx.moveTo(60, 145);
    ctx.lineTo(canvas.width - 60, 145);
    ctx.stroke();

    // Load actual generated image into drawing canvas
    const imgObj = new Image();
    imgObj.crossOrigin = "anonymous";
    imgObj.src = this.renderImage.src;

    imgObj.onload = () => {
      // Draw centered frame for the main image with thin glowing border
      const rectX = 100;
      const rectY = 180;
      const rectW = 1000;
      const rectH = 1000;

      // Draw shadow/glow border around image
      ctx.fillStyle = "#010206";
      ctx.fillRect(rectX, rectY, rectW, rectH);

      // Composite Layer 1: Exterior Shell
      ctx.globalAlpha = this.state.layers.shell.visible ? this.state.layers.shell.opacity : 0;
      ctx.drawImage(imgObj, rectX, rectY, rectW, rectH);

      // Composite Layer 2: Skeletal Mesh (screen radiographic edge extraction)
      if (this.state.layers.skeleton.visible && this.state.layers.skeleton.opacity > 0) {
        ctx.globalAlpha = this.state.layers.skeleton.opacity;
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'invert(0.9) hue-rotate(185deg) saturate(2) contrast(1.7) brightness(0.9)';
        ctx.drawImage(imgObj, rectX, rectY, rectW, rectH);
      }

      // Composite Layer 3: Internal System / process flow (color-dodge warm path)
      if (this.state.layers.process.visible && this.state.layers.process.opacity > 0) {
        ctx.globalAlpha = this.state.layers.process.opacity;
        ctx.globalCompositeOperation = 'color-dodge';
        ctx.filter = 'saturate(3) hue-rotate(330deg) brightness(0.95) contrast(1.5)';
        ctx.drawImage(imgObj, rectX, rectY, rectW, rectH);
      }

      // Reset composite settings
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      // Composite Layer 4: Telemetry Coordinate Grid
      if (this.state.layers.telemetry.visible && this.state.layers.telemetry.opacity > 0) {
        ctx.globalAlpha = this.state.layers.telemetry.opacity;
        ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
        ctx.lineWidth = 1.5;
        
        // Draw dashed grid outline
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(rectX + 20, rectY + 20, rectW - 40, rectH - 40);
        ctx.setLineDash([]);
        
        // Draw nested grids
        ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
        const step = 100;
        for (let gx = rectX + step; gx < rectX + rectW; gx += step) {
          ctx.beginPath(); ctx.moveTo(gx, rectY + 20); ctx.lineTo(gx, rectY + rectH - 20); ctx.stroke();
        }
        for (let gy = rectY + step; gy < rectY + rectH; gy += step) {
          ctx.beginPath(); ctx.moveTo(rectX + 20, gy); ctx.lineTo(rectX + rectW - 20, gy); ctx.stroke();
        }
        
        // Corner coordinate ticks
        ctx.fillStyle = "var(--accent-cyan, #5ce6ff)";
        ctx.font = "bold 12px 'Fira Code', monospace";
        ctx.fillText("GRID_REF: CA-1024", rectX + 35, rectY + 45);
        ctx.fillText("SCAN: COMPOSITE", rectX + 35, rectY + rectH - 35);
      }
      
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = "rgba(0, 229, 255, 0.3)";
      ctx.lineWidth = 3;
      ctx.strokeRect(rectX, rectY, rectW, rectH);

      // Plate info footer box
      const footerY = 1210;
      ctx.fillStyle = "rgba(10, 16, 32, 0.8)";
      ctx.fillRect(100, footerY, 1000, 310);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
      ctx.strokeRect(100, footerY, 1000, 310);

      // Tech details columns
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px 'Outfit', sans-serif";
      ctx.fillText("SYNTHESIS SPECIFICATIONS", 130, footerY + 45);

      ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
      ctx.font = "bold 13px 'Fira Code', monospace";
      ctx.fillText("PARAMETER REFERENCE KEYS:", 130, footerY + 85);

      const items = [
        `SUBJECT TARGET: ${promptInfo.subject.toUpperCase()}`,
        `VISUALIZATION MODE: ${this.inputs.visualMode.value.toUpperCase()}`,
        `VOLUMETRIC LIGHTING: ${this.inputs.lightingStyle.value.split('.')[0]}`,
        `CHROMATIC DENSITY: ${this.inputs.paletteStyle.value.split('.')[0]}`,
        `COMPOSITION STYLE: ${this.inputs.compositionStyle.value.split('.')[0]}`,
        `DIAGNOSTIC aura: ${this.inputs.moodStyle.value.toUpperCase()}`
      ];

      ctx.fillStyle = "#e0e8f5";
      ctx.font = "14px 'Outfit', sans-serif";
      items.forEach((item, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        ctx.fillText(`• ${item}`, 130 + col * 480, footerY + 125 + row * 35);
      });

      // Write compiled prompt at bottom
      ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
      ctx.font = "bold 13px 'Fira Code', monospace";
      ctx.fillText("SYNTHETIC PROMPT MATRIX INPUTS:", 130, footerY + 235);

      ctx.fillStyle = "#8fa0c0";
      ctx.font = "italic 13px 'Fira Code', monospace";
      const wrapText = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + ' ';
          let metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
      };
      
      const cleanPromptSentence = promptInfo.mainOnly;
      wrapText(cleanPromptSentence, 130, footerY + 260, 940, 18);

      // Trigger plate automatic download
      const plateUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `cyber-atlas-plate-${promptInfo.subject.replace(/\s+/g, '_')}.png`;
      link.href = plateUrl;
      link.click();
      
      this.showToast("Educational Plate generated and downloaded!");
    };
    
    imgObj.onerror = () => {
      this.showToast("Failed loading generated image source into compiler.", true);
    };
  }

  // --- GENERAL APP UTILS ---
  showToast(msg, isError = false) {
    this.toastMessage.textContent = msg;
    const icon = this.toastContainer.querySelector("svg");
    if (isError) {
      icon.innerHTML = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`;
      icon.style.color = "#ff4444";
      this.toastContainer.style.borderColor = "rgba(255, 68, 68, 0.4)";
    } else {
      icon.innerHTML = `<polyline points="20 6 9 17 4 12"/>`;
      icon.style.color = "var(--accent-teal)";
      this.toastContainer.style.borderColor = "var(--border-glow)";
    }
    
    this.toastContainer.classList.add("show");
    setTimeout(() => {
      this.toastContainer.classList.remove("show");
    }, 3000);
  }

  copyPromptToClipboard() {
    const promptInfo = this.buildPrompt();
    navigator.clipboard.writeText(promptInfo.fullText).then(() => {
      this.showToast("Full structured prompt copied to clipboard!");
    }).catch(() => {
      this.showToast("Clipboard write blocked. Select manually.", true);
    });
  }

  resetConfigForm() {
    // Reset inputs to standard
    this.inputs.subjectType.selectedIndex = 0;
    this.inputs.subjectInput.value = "full human body";
    this.inputs.extraNotes.value = "";
    
    this.fields.forEach(id => {
      if (id !== 'subjectType' && id !== 'subjectInput' && id !== 'extraNotes') {
        this.inputs[id].selectedIndex = 0;
      }
    });

    this.buildPrompt();
    this.showToast("All configuration parameters reset.");
  }

  // --- MAGIC LAYERS DIAGNOSTIC CONTROLS ---
  applyLayerStyles() {
    const shell = this.state.layers.shell;
    const skeleton = this.state.layers.skeleton;
    const process = this.state.layers.process;
    const telemetry = this.state.layers.telemetry;

    this.layerBase.style.opacity = shell.visible ? shell.opacity : 0;
    this.layerSkeleton.style.opacity = skeleton.visible ? skeleton.opacity : 0;
    this.layerProcess.style.opacity = process.visible ? process.opacity : 0;
    this.layerTelemetry.style.opacity = telemetry.visible ? telemetry.opacity : 0;
  }

  resetLayerControls(visualMode = '') {
    let shellVal = 100;
    let skeletonVal = 0;
    let processVal = 0;
    let telemetryVal = 0;

    const mode = visualMode.toLowerCase();
    if (mode.includes("x-ray") || mode.includes("radiographic")) {
      shellVal = 30;
      skeletonVal = 100;
      processVal = 10;
      telemetryVal = 20;
    } else if (mode.includes("cutaway") || mode.includes("section")) {
      shellVal = 70;
      skeletonVal = 15;
      processVal = 85;
      telemetryVal = 30;
    } else if (mode.includes("exploded") || mode.includes("diagram")) {
      shellVal = 100;
      processVal = 40;
      telemetryVal = 50;
    } else if (mode.includes("blueprint") || mode.includes("technical")) {
      shellVal = 50;
      telemetryVal = 80;
    }

    const configs = {
      shell: shellVal,
      skeleton: skeletonVal,
      process: processVal,
      telemetry: telemetryVal
    };

    Object.keys(configs).forEach(layer => {
      const val = configs[layer];
      this.state.layers[layer].opacity = val / 100;
      this.state.layers[layer].visible = true;
      
      const slider = document.getElementById(`slider_${layer}`);
      const label = document.getElementById(`opcLabel_${layer}`);
      const visBtn = document.querySelector(`.layer-vis-btn[data-layer="${layer}"]`);
      
      if (slider) slider.value = val;
      if (label) label.textContent = `OPC: ${val}%`;
      if (visBtn) {
        visBtn.classList.add("active");
        const svg = visBtn.querySelector("svg");
        if (svg) svg.style.opacity = "1";
        visBtn.style.color = "var(--accent-cyan)";
      }
    });

    this.applyLayerStyles();
  }
}

// Instantiate App
window.addEventListener("DOMContentLoaded", () => {
  window.cyberAtlas = new CyberAtlasApp();
});
