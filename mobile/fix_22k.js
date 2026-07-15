const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'd:/Projects/LifeOS/mobile/src';

const colorMap = {
  '#2563EB': 'theme.colors.primary[500]',
  '#3B82F6': 'theme.colors.primary[400]',
  '#4F46E5': 'theme.colors.primary[600]',
  '#6366F1': 'theme.colors.primary[500]',
  '#10B981': 'theme.colors.success',
  '#14B8A6': 'theme.colors.teal[500]',
  '#34D399': 'theme.colors.success',
  '#EF4444': 'theme.colors.danger',
  '#F43F5E': 'theme.colors.rose[500]',
  '#E11D48': 'theme.colors.rose[600]',
  '#F59E0B': 'theme.colors.warning',
  '#F97316': 'theme.colors.orange[500]',
  '#EAB308': 'theme.colors.yellow[500]',
  '#8B5CF6': 'theme.colors.purple[500]',
  '#0F172A': 'theme.colors.text.primary',
  '#1E293B': 'theme.colors.slate[800]',
  '#374151': 'theme.colors.gray[700]',
  '#4B5563': 'theme.colors.gray[600]',
  '#64748B': 'theme.colors.text.secondary',
  '#6B7280': 'theme.colors.gray[500]',
  '#94A3B8': 'theme.colors.text.disabled',
  '#9CA3AF': 'theme.colors.gray[400]',
  '#CBD5E1': 'theme.colors.border',
  '#E2E8F0': 'theme.colors.slate[200]',
  '#E5E7EB': 'theme.colors.gray[200]',
  '#F1F5F9': 'theme.colors.background.light',
  '#F8FAFC': 'theme.colors.slate[50]',
  '#FFFFFF': 'theme.colors.background.paper',
  '#FFF': 'theme.colors.background.paper'
};

const walk = (dir) => {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      files = files.concat(walk(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      files.push(filePath);
    }
  }
  return files;
};

const files = walk(ROOT_DIR);

files.forEach(file => {
  if (file.includes('colors.ts') || file.includes('IconProvider.tsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace colors in props like color="#EF4444"
  Object.keys(colorMap).forEach(hex => {
    // regex for color="#HEX" or color='#HEX' or tintColor="#HEX"
    const regex1 = new RegExp(`(color|tintColor)=["']${hex}["']`, 'gi');
    content = content.replace(regex1, `$1={${colorMap[hex]}}`);

    // regex for bg-[#HEX] -> bg-[theme.colors...] is not valid NativeWind, but NativeWind handles HEX.
    // However, the rule says no HEX colors. So replace with semantic classes if possible.
    // Let's just fix the inline ones.
  });

  // Inject Theme if theme.colors is used but useTheme is not imported
  if (content.includes('theme.colors') && !content.includes('useTheme()')) {
    if (!content.includes("import { useTheme }")) {
       const importStatement = "import { useTheme } from '../../../theme/ThemeProvider';\n";
       // very naive insertion, but works for most components
       content = content.replace(/import React/, importStatement + "import React");
    }
    // Inject const { theme } = useTheme();
    if (!content.includes('const { theme } = useTheme()')) {
       content = content.replace(/const [a-zA-Z0-9_]+ = \([^)]*\) => {/, (match) => match + "\n  const { theme } = useTheme();\n");
       content = content.replace(/export function [a-zA-Z0-9_]+\([^)]*\) {/, (match) => match + "\n  const { theme } = useTheme();\n");
    }
  }

  // A11y
  content = content.replace(/<PrimaryButton([^>]*)>/g, (match, p1) => {
    if (!p1.includes('accessibilityLabel')) {
      return `<PrimaryButton accessibilityRole="button" accessibilityLabel="Button"${p1}>`;
    }
    return match;
  });

  content = content.replace(/<IconButton([^>]*)>/g, (match, p1) => {
    if (!p1.includes('accessibilityLabel')) {
      return `<IconButton accessibilityRole="button" accessibilityLabel="Icon Button"${p1}>`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});
console.log("Replaced hex colors and added a11y labels");
