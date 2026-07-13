const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
};

const files = walk('D:/Projects/LifeOS/mobile/src/features/journal');

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix duplicate className attributes!
    // We can do this safely:
    content = content.replace(/className="([^"]+)"\s+className="([^"]+)"/g, 'className="$1 $2"');
    content = content.replace(/className="([^"]+)"\s+className="([^"]+)"/g, 'className="$1 $2"');
    
    fs.writeFileSync(file, content, 'utf8');
  }
});
