/**
 * fix_all.cjs — Kaslee Frontend Cleanup
 * Roda na raiz do projeto: node fix_all.cjs
 *
 * O que faz:
 * 1. Corrige logos antigas → /img/Logo Clara.png
 * 2. Corrige cores #2c5aa0 → #2f0d51
 * 3. Remove "Compra Smart" → "Kaslee"
 * 4. Corrige HTML entities corrompidas (&#cccc0c; etc)
 * 5. Remove imports de /img/kaslee_icon (substituindo por aviso)
 * 6. Substitui dangerouslySetInnerHTML com HTML entities de ícones → Phosphor
 * 7. Adiciona import Phosphor quando necessário
 */

const fs = require('fs');
const path = require('path');

// ─── MAPA: HTML entity → { phosphorName, fallbackEmoji }
const ENTITY_ICON_MAP = {
  '&#127968;': { name: 'House',            emoji: '🏠' },
  '&#128230;': { name: 'Package',          emoji: '📦' },
  '&#128202;': { name: 'ChartBar',         emoji: '📊' },
  '&#128172;': { name: 'Chat',             emoji: '💬' },
  '&#128197;': { name: 'Calendar',         emoji: '📅' },
  '&#128179;': { name: 'CreditCard',       emoji: '💳' },
  '&#128101;': { name: 'Users',            emoji: '👥' },
  '&#128722;': { name: 'ShoppingCart',     emoji: '🛒' },
  '&#128200;': { name: 'TrendUp',          emoji: '📈' },
  '&#127891;': { name: 'GraduationCap',    emoji: '🎓' },
  '&#128221;': { name: 'ClipboardText',    emoji: '📝' },
  '&#128100;': { name: 'User',             emoji: '👤' },
  '&#128188;': { name: 'Briefcase',        emoji: '💼' },
  '&#128274;': { name: 'Lock',             emoji: '🔒' },
  '&#128269;': { name: 'MagnifyingGlass',  emoji: '🔍' },
  '&#127978;': { name: 'Storefront',       emoji: '🏪' },
  '&#128276;': { name: 'Bell',             emoji: '🔔' },
  '&#128295;': { name: 'Wrench',           emoji: '🔧' },
  '&#9733;':   { name: 'Star',             emoji: '⭐' },
  '&#128640;': { name: 'Rocket',           emoji: '🚀' },
  '&#9989;':   { name: 'CheckCircle',      emoji: '✅' },
  '&#128204;': { name: 'MapPin',           emoji: '📍' },
  '&#128241;': { name: 'DeviceMobile',     emoji: '📱' },
  // corrompidas
  '&#cccc0c;': { name: 'ChartBar',         emoji: '📊' },
};

// ─── FIXES SIMPLES (regex → replacement)
const SIMPLE_FIXES = [
  // Logos antigas
  { from: /src=["']\/img\/logo_compra_smart\.png["']/g,  to: 'src="/img/Logo Clara.png"' },
  { from: /src=["']\/img\/logo\.png["']/g,               to: 'src="/img/Logo Clara.png"' },
  { from: /src=["']\/img\/Logo\.png["']/g,               to: 'src="/img/Logo Clara.png"' },
  { from: /src=["']\/img\/kaslee_logo\.png["']/g,        to: 'src="/img/Logo Clara.png"' },
  { from: /src=["']\.\.\/\.\.\/\.\.\/img\/Logo Clara\.png["']/g, to: 'src="/img/Logo Clara.png"' },
  // Cores antigas
  { from: /#2c5aa0/g,   to: '#2f0d51' },
  { from: /#4a6fa5/g,   to: '#2f0d51' },
  { from: /#17a2b8/g,   to: '#bb25a6' },
  // Nome antigo
  { from: /Compra Smart/g, to: 'Kaslee' },
  { from: /compra-smart/g, to: 'kaslee' },
  // Entities corrompidas (texto literal)
  { from: /&#cccc0c;/g,  to: '' },
  { from: /„¹/g,         to: 'ℹ️' },
];

// ─── PHOSPHOR: icons usados nos menus via dangerouslySetInnerHTML
// Substitui padrão: <span dangerouslySetInnerHTML={{ __html: "&#XXXXX;" }} />
// por: <PhosphorIcon size={20} weight="duotone" color="currentColor" />
function replaceEntitySpans(content, iconsUsed) {
  return content.replace(
    /<span\s+dangerouslySetInnerHTML=\{\{\s*__html:\s*["']([^"']+)["']\s*\}\}\s*(?:style=\{[^}]*\})?\s*\/>/g,
    (match, entity) => {
      const trimmed = entity.trim();
      const mapped = ENTITY_ICON_MAP[trimmed];
      if (mapped) {
        iconsUsed.add(mapped.name);
        return `<${mapped.name} size={20} weight="duotone" color="currentColor" />`;
      }
      // fallback: tenta decodificar a entity
      return match;
    }
  );
}

// ─── Adiciona import Phosphor se necessário
function ensurePhosphorImport(content, iconsUsed) {
  if (iconsUsed.size === 0) return content;
  const iconList = [...iconsUsed].join(', ');
  // Se já tem import @phosphor-icons/react, adiciona os novos
  if (content.includes('@phosphor-icons/react')) {
    return content.replace(
      /import\s*\{([^}]+)\}\s*from\s*['"]@phosphor-icons\/react['"]/,
      (match, existing) => {
        const existingIcons = existing.split(',').map(s => s.trim()).filter(Boolean);
        const allIcons = [...new Set([...existingIcons, ...iconsUsed])].sort();
        return `import { ${allIcons.join(', ')} } from '@phosphor-icons/react'`;
      }
    );
  }
  // Adiciona novo import depois dos outros imports
  const lastImport = content.lastIndexOf('\nimport ');
  if (lastImport !== -1) {
    const insertAt = content.indexOf('\n', lastImport + 1);
    return content.slice(0, insertAt + 1) +
      `import { ${iconList} } from '@phosphor-icons/react';\n` +
      content.slice(insertAt + 1);
  }
  return `import { ${iconList} } from '@phosphor-icons/react';\n` + content;
}

// ─── Remove uso de /img/kaslee_icon (SVG local)
function removeKasleeIconRefs(content) {
  // Remove linha: const BASE_ICON = "/img/kaslee_icon";
  content = content.replace(/const BASE_ICON\s*=\s*["']\/img\/kaslee_icon["'][^;]*;?\n?/g, '');
  content = content.replace(/const BASE\s*=\s*["']\/img\/kaslee_icon["'][^;]*;?\n?/g, '');
  // Remove componente Icon local que usa img src
  content = content.replace(
    /const Icon\s*=\s*\(\{[^}]*\}\)\s*=>\s*\(\s*<img[^>]*kaslee_icon[^>]*\/>\s*\);?\n?/g, ''
  );
  // Substitui uso de <Icon name="..." /> por comentário (não conseguimos saber qual Phosphor usar)
  content = content.replace(
    /<Icon\s+name=["'][^"']*["'][^/]*\/>/g,
    '{/* ⚠️ substituir por ícone Phosphor */}'
  );
  return content;
}

// ─── PROCESSAR ARQUIVO
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  const iconsUsed = new Set();

  // 1. Fixes simples
  SIMPLE_FIXES.forEach(({ from, to }) => { content = content.replace(from, to); });

  // 2. Remove kaslee_icon refs
  content = removeKasleeIconRefs(content);

  // 3. Substitui dangerouslySetInnerHTML entity spans
  content = replaceEntitySpans(content, iconsUsed);

  // 4. Garante import Phosphor
  content = ensurePhosphorImport(content, iconsUsed);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// ─── WALK
function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(file => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) walk(fp, results);
    } else if (file.match(/\.(jsx|tsx|js|ts)$/) && !file.includes('.test.')) {
      results.push(fp);
    }
  });
  return results;
}

// ─── MAIN
const files = walk('src');
let changed = 0;
let warnings = 0;

files.forEach(fp => {
  try {
    if (processFile(fp)) {
      console.log('✅', fp.replace('src/', ''));
      changed++;
    }
  } catch (e) {
    console.warn('⚠️  Erro em', fp, '→', e.message);
    warnings++;
  }
});

console.log(`\n🎯 ${changed} arquivos atualizados, ${warnings} erros`);
console.log('\n📌 ATENÇÃO: Procure por "⚠️ substituir por ícone Phosphor" nos arquivos');
console.log('   Esses são lugares onde o script não conseguiu inferir o ícone correto.\n');
