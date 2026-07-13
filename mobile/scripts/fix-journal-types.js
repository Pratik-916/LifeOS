const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
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
    
    // Replace color="..." with className="..." inside Typography and ReflectionCard etc 
    // Wait, some other components might use color (like icons).
    // Let's only replace color="..." inside Typography
    content = content.replace(/<Typography([^>]*)color="([^"]+)"/g, '<Typography$1className="$2"');
    // since the attributes might be reversed, we should do a second pass
    content = content.replace(/<Typography([^>]*)color="([^"]+)"/g, '<Typography$1className="$2"');
    
    content = content.replace(/variant="h4"/g, 'variant="h3"');
    content = content.replace(/variant="subtitle1"/g, 'variant="h3"');
    content = content.replace(/variant="subtitle2"/g, 'variant="label"');
    content = content.replace(/variant="body1"/g, 'variant="body"');
    content = content.replace(/variant="body2"/g, 'variant="body"');
    
    // Replace Button with children
    // <Button ...>Text</Button> -> <Button ... title="Text" />
    content = content.replace(/<Button([^>]*)>([^<]+)<\/Button>/g, '<Button$1 title="$2" />');
    
    fs.writeFileSync(file, content, 'utf8');
  }
});
