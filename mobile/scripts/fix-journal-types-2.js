const fs = require('fs');
const path = require('path');

// 1. Fix Journal UI components
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
    
    content = content.replace(/className="([^"]+)"\s+className="([^"]+)"/g, 'className="$1 $2"');
    content = content.replace(/<Typography([^>]*)color="([^"]+)"/g, '<Typography$1className="$2"');
    content = content.replace(/className="([^"]+)"\s+className="([^"]+)"/g, 'className="$1 $2"');
    
    // Unused err
    content = content.replace(/catch \(err\)/g, 'catch (_err)');
    
    // Unused useCallback, Check, BookOpen in JournalEditorScreen
    content = content.replace(/, useCallback/g, '');
    content = content.replace(/, Check, Sparkles, BookOpen/g, ', Sparkles');
    
    // Unused ActivityIndicator in JournalScreen
    content = content.replace(/, ActivityIndicator/g, '');
    
    fs.writeFileSync(file, content, 'utf8');
  }
});

// 2. Fix BottomTabNavigator
const btnPath = 'D:/Projects/LifeOS/mobile/src/navigation/BottomTabNavigator.tsx';
let btnContent = fs.readFileSync(btnPath, 'utf8');
btnContent = btnContent.replace(/component=\{JournalPlaceholder\}/g, 'component={JournalScreen}');
fs.writeFileSync(btnPath, btnContent, 'utf8');
