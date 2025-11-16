// src/pages/LojistaDashboard/index.js

// Re-exporta todos os componentes nomeados de cada arquivo .jsx
// Este é o método mais robusto quando se usam Named Exports (export const Nome)

export { LojistaDashboard } from "./pages/LojistaDashboard";
export { LojistaEscolha } from "./pages/LojistaEscolha";
export { LojistaFiliais } from "./pages/LojistaFiliais";
export { LojistaHomePanel } from "./pages/LojistaHomePanel";
export { LojistaPagamentos } from "./pages/LojistaPagamentos";
export { LojistaProducts } from "./pages/LojistaProducts";
export { LojistaQRCode } from "./pages/LojistaQRCode";
export { LojistaRelatorios } from "./pages/LojistaRelatorios";
export { LojistaUsuarios } from "./pages/LojistaUsuarios";
export { LojistaVendedores } from "./pages/LojistaVendedores";

// Se o seu LojistaDashboard.jsx também contiver os mocks de outros componentes,
// certifique-se de que os arquivos individuais (como LojistaQRCode.jsx)
// exportam algo, ou que o LojistaDashboard.jsx seja o único a exportá-los.