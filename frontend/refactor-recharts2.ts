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

    // Tooltip cursor
    content = content.replace(/cursor=\{\{\s*fill:\s*['"]rgb\(var\(--color-surfaceHighlight\)\)['"]\s*\}\}/g, "cursor={{fill: 'var(--chart-cursor)'}}");
    content = content.replace(/cursor=\{\{\s*fill:\s*['"]rgb\(var\(--color-border\)\)['"]\s*\}\}/g, "cursor={{fill: 'var(--chart-cursor)'}}");

    // Grid stroke
    content = content.replace(/stroke=\s*["']rgb\(var\(--color-border\)\)["']/g, 'stroke="var(--chart-grid)"');
    
    // Axes and Legend text
    content = content.replace(/stroke=\s*["']rgb\(var\(--color-secondary\)\)["']/g, 'stroke="var(--chart-text)"');
    
    // Bar fill for Dashboard.tsx
    content = content.replace(/fill=\s*["']rgb\(var\(--color-accent\)\)["']/g, 'fill="#3b82f6"'); // hardcode to blue or we can define a --chart-accent
    
    // Tooltip styles
    content = content.replace(/backgroundColor:\s*['"]rgb\(var\(--color-surface\)\)['"]/g, "backgroundColor: 'var(--chart-bg)'");
    content = content.replace(/borderColor:\s*['"]rgb\(var\(--color-border\)\)['"]/g, "borderColor: 'var(--chart-border)'");
    content = content.replace(/color:\s*['"]rgb\(var\(--color-primary\)\)['"]/g, "color: 'var(--color-primary)'"); // This is fine in CSS styles, but let's just make it standard if it causes issues. Actually it's an inline style so it's fine.

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      modifiedFiles++;
    }
  }
});

console.log(`Successfully refactored ${modifiedFiles} Recharts files to use SVG-valid CSS variables.`);
