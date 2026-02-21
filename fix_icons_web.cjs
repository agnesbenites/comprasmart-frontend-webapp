const fs = require('fs');
const path = require('path');

const EMOJI_MAP = {
  '🏠': 'House',
  '📋': 'ClipboardText',
  '💬': 'ChatCircle',
  '📜': 'Scroll',
  '📊': 'ChartBar',
  '💰': 'CurrencyDollar',
  '🏪': 'Storefront',
  '👥': 'Users',
  '⭐': 'Star',
  '🎓': 'GraduationCap',
  '📈': 'TrendUp',
  '👤': 'User',
  '🔍': 'MagnifyingGlass',
  '🔄': 'ArrowsClockwise',
  '📍': 'MapPin',
  '💳': 'CreditCard',
  '🎉': 'Gift',
  '✅': 'CheckCircle',
  '❌': 'XCircle',
  '⏳': 'HourglassHigh',
  '🔔': 'Bell',
  '📱': 'DeviceMobile',
  '🛍️': 'ShoppingBag',
  '🎁': 'Gift',
  '🔒': 'Lock',
  '📞': 'Phone',
  '🚪': 'SignOut',
  '📦': 'Package',
  '🏆': 'Trophy',
  '💡': 'Lightbulb',
  '🎯': 'Target',
  '🛒': 'ShoppingCart',
  '📄': 'FileText',
  '🤖': 'Robot',
  '📷': 'Camera',
  '🔥': 'Fire',
  '✨': 'Sparkle',
  '💸': 'Money',
  '🏅': 'Medal',
};

const IMPORT_LINE = `import { ${Object.values(EMOJI_MAP).filter((v,i,a)=>a.indexOf(v)===i).join(', ')} } from '@phosphor-icons/react';`;

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;

  // Remove emojis
  Object.keys(EMOJI_MAP).forEach(e => {
    content = content.split(e).join('');
  });

  // Add import if not already there
  if (!content.includes('@phosphor-icons/react')) {
    const lines = content.split('\n');
    let lastImport = 0;
    lines.forEach((line, i) => { if (line.startsWith('import ')) lastImport = i; });
    lines.splice(lastImport + 1, 0, IMPORT_LINE);
    content = lines.join('\n');
  }

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    return true;
  }
  return false;
}

// Process ConsultorDashboard first
const dirs = [
  'src/pages/ConsultorDashboard',
  'src/pages',
  'src/components',
];

let count = 0;
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const walk = (d) => {
    fs.readdirSync(d).forEach(file => {
      const fp = path.join(d, file);
      if (fs.statSync(fp).isDirectory()) return walk(fp);
      if (file.match(/\.(jsx|js|tsx)$/)) {
        if (processFile(fp)) { console.log('✅', fp); count++; }
      }
    });
  };
  walk(dir);
});

console.log(`\n🎯 ${count} arquivos atualizados!`);
