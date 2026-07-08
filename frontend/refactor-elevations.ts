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

    // Remove opacities from surfaceHighlight as the token itself is now perfectly balanced
    content = content.replace(/bg-surfaceHighlight\/[0-9]+/g, 'bg-surfaceHighlight');
    content = content.replace(/hover:bg-surfaceHighlight\/[0-9]+/g, 'hover:bg-surfaceHighlight');
    
    // Also remove color-scheme:dark hardcodes from inputs since we want light mode inputs to support light scheme
    content = content.replace(/\[color-scheme:dark\]/g, 'dark:[color-scheme:dark] [color-scheme:light]');

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      modifiedFiles++;
    }
  }
});

console.log(`Successfully refactored ${modifiedFiles} files to fix semantic elevations.`);
