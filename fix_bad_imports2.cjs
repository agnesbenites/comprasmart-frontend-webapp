const fs = require('fs');

const PHOSPHOR_LINE = /import \{ House, ClipboardText[^\n]+\n/g;

const walk = (d) => {
  const items = fs.readdirSync(d);
  items.forEach(file => {
    const fp = require('path').join(d, file);
    if (fs.statSync(fp).isDirectory()) return walk(fp);
    if (!file.match(/\.(js|jsx|tsx)$/)) return;
    
    let content = fs.readFileSync(fp, 'utf8');
    const original = content;
    
    // Remove qualquer import do Phosphor que esteja mal posicionado (dentro de outro import)
    content = content.replace(PHOSPHOR_LINE, '');
    
    if (content !== original) {
      fs.writeFileSync(fp, content, 'utf8');
      console.log('✅ corrigido:', fp);
    }
  });
};

walk('src');
console.log('\n🎯 Concluído!');
