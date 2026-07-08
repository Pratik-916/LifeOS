const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let changed = false;

  // Add Variants import if not exists
  if (content.includes('framer-motion') && !content.includes('import type { Variants }') && !content.includes('Variants } from \'framer-motion\'')) {
    content = content.replace(/import {([^}]*motion[^}]*)} from 'framer-motion';/g, "import { $1 } from 'framer-motion';\nimport type { Variants } from 'framer-motion';");
    changed = true;
  }

  if (content.includes('const containerVariants = {')) {
    content = content.replace('const containerVariants = {', 'const containerVariants: Variants = {');
    changed = true;
  }
  
  if (content.includes('const itemVariants = {')) {
    content = content.replace('const itemVariants = {', 'const itemVariants: Variants = {');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed variants in', file);
  }
}
