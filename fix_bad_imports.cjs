const fs = require('fs');
const path = require('path');

const PHOSPHOR_IMPORT = /import \{ House, ClipboardText.*?@phosphor-icons\/react.*?\n/g;

const BAD_EXTENSIONS = ['.js']; // só .js puros, não .jsx

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;

  // Remove import do Phosphor de arquivos .js que não são componentes React
  if (!content.includes('import React') && !content.includes('from "react"') && !content.includes("from 'react'")) {
    content = content.replace(PHOSPHOR_IMPORT, '');
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
    if (file.endsWith('.js')) {
      if (processFile(fp)) console.log('✅ corrigido:', fp);
    }
  });
};

walk('src');
console.log('\n🎯 Concluído!');
