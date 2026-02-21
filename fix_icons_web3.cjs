const fs = require('fs');
const path = require('path');

// Mapeamento estilo -> ícone Phosphor
const STYLE_ICON_MAP = {
  'emptyIcon':       '<HourglassHigh size={80} weight="duotone" color="#2f0d51" />',
  'supportIcon':     '<Lifebuoy size={48} weight="duotone" color="#2f0d51" />',
  'actionIcon':      '<CheckCircle size={24} weight="duotone" color="#bb25a6" />',
  'opcaoIcon':       '<Tag size={20} weight="duotone" color="#2f0d51" />',
  'urgenciaIcon':    '<Clock size={14} weight="duotone" color="white" />',
  'successIcon':     '<CheckCircle size={80} weight="duotone" color="#bb25a6" />',
  'logoEmoji':       '<Storefront size={48} weight="duotone" color="#2f0d51" />',
  'headerIcon':      '<House size={24} weight="duotone" color="#2f0d51" />',
  'emptyChatIcon':   '<ChatCircle size={80} weight="duotone" color="#2f0d51" />',
  'dangerIcon':      '<XCircle size={48} weight="duotone" color="#e74c3c" />',
  'actionButtonIcon':'<CheckCircle size={20} weight="duotone" color="white" />',
};

const PHOSPHOR_IMPORT = `import { House, CheckCircle, XCircle, Clock, Tag, HourglassHigh, Lifebuoy, Storefront, ChatCircle } from '@phosphor-icons/react';`;

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;

  let replaced = false;
  Object.entries(STYLE_ICON_MAP).forEach(([styleName, jsx]) => {
    const regex = new RegExp(`<[a-zA-Z]+\\s[^>]*style=\\{styles\\.${styleName}\\}[^>]*>\\s*<\\/[a-zA-Z]+>`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `<div style={styles.${styleName}}>${jsx}</div>`);
      replaced = true;
    }
  });

  // Add import if needed and not already there
  if (replaced && !content.includes('@phosphor-icons/react')) {
    const lines = content.split('\n');
    let lastImport = 0;
    lines.forEach((line, i) => { if (line.startsWith('import ')) lastImport = i; });
    lines.splice(lastImport + 1, 0, PHOSPHOR_IMPORT);
    content = lines.join('\n');
  }

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    return true;
  }
  return false;
}

const walk = (d) => {
  fs.readdirSync(d).forEach(file => {
    const fp = path.join(d, file);
    if (fs.statSync(fp).isDirectory()) return walk(fp);
    if (file.match(/\.(jsx|tsx)$/)) {
      if (processFile(fp)) console.log('✅', fp);
    }
  });
};

walk('src');
console.log('\n🎯 Concluído!');
