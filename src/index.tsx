import React from "react";
import { createRoot } from "react-dom/client";
import { ModularCompositePromptBuilder } from "./components/ModularCompositePromptBuilder";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<ModularCompositePromptBuilder />);
}
