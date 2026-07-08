import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (filepath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

let modifiedFiles = 0;

walk('./src', (filepath) => {
  if (filepath.endsWith('.tsx')) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // Tooltip
    content = content.replace(/backgroundColor:\s*['"]#1e1e1e['"]/g, "backgroundColor: 'rgb(var(--color-surface))', color: 'rgb(var(--color-primary))'");
    content = content.replace(/borderColor:\s*['"]rgba\(255,255,255,0.1\)['"]/g, "borderColor: 'rgb(var(--color-border))'");
    
    // Axes and Legend text
    content = content.replace(/stroke=\s*["']#a3a3a3["']/g, 'stroke="rgb(var(--color-secondary))"');
    
    // Grids
    content = content.replace(/stroke=\s*["']rgba\(255,255,255,0.05\)["']/g, 'stroke="rgb(var(--color-border))"');
    
    // Cursors
    content = content.replace(/cursor=\{\{\s*fill:\s*['"]rgba\(255,255,255,0.05\)['"]\s*\}\}/g, "cursor={{fill: 'rgb(var(--color-surfaceHighlight))'}}");
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      modifiedFiles++;
    }
  }
});

console.log(`Successfully refactored ${modifiedFiles} Recharts files.`);
