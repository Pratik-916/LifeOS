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
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // Borders
    content = content.replace(/border-white\/(5|10|20|30|50)/g, 'border-border');
    content = content.replace(/divide-white\/(5|10|20)/g, 'divide-border');
    
    // Backgrounds
    content = content.replace(/bg-white\/(5|10)/g, 'bg-surfaceHighlight/50');
    content = content.replace(/bg-white\/20/g, 'bg-surfaceHighlight');
    
    // Texts
    content = content.replace(/text-white\/20/g, 'text-secondary/50');
    content = content.replace(/text-white\/30/g, 'text-secondary/50');
    content = content.replace(/text-white\/50/g, 'text-secondary');
    content = content.replace(/text-white\/60/g, 'text-secondary');
    
    // Gradients
    content = content.replace(/from-accent to-purple-500/g, 'bg-accent');
    content = content.replace(/bg-gradient-to-r bg-accent/g, 'bg-accent');
    content = content.replace(/bg-gradient-to-br from-surface to-surfaceHighlight/g, 'bg-surface');
    
    // Rings
    content = content.replace(/ring-white\/(20|50)/g, 'ring-border');
    
    // Empty state dash borders
    content = content.replace(/border-dashed border-border/g, 'border-dashed border-border/50');
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      modifiedFiles++;
    }
  }
});

console.log(`Successfully refactored ${modifiedFiles} files.`);
