const fs = require('fs');
const path = require('path');

const fixPath = (file) => {
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/from '\.\.\/\.\.\/\.\.\/theme\/ThemeProvider'/g, "from '../../theme/ThemeProvider'");
    fs.writeFileSync(file, c);
  }
};

fixPath('d:/Projects/LifeOS/mobile/src/design-system/inputs/Input.tsx');
fixPath('d:/Projects/LifeOS/mobile/src/design-system/buttons/Button.tsx');
fixPath('d:/Projects/LifeOS/mobile/src/design-system/cards/Card.tsx');
fixPath('d:/Projects/LifeOS/mobile/src/design-system/chips/Chip.tsx');
fixPath('d:/Projects/LifeOS/mobile/src/design-system/badges/Badge.tsx');
// loaders don't use theme usually, but we check all just in case
const walk = (dir) => {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes("from '../../../theme/ThemeProvider'")) {
         content = content.replace(/from '\.\.\/\.\.\/\.\.\/theme\/ThemeProvider'/g, "from '../../theme/ThemeProvider'");
         fs.writeFileSync(filePath, content);
      }
    }
  }
};
walk('d:/Projects/LifeOS/mobile/src/design-system');
console.log('Fixed paths');
