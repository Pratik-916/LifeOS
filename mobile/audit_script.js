const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'd:/Projects/LifeOS/mobile/src';

const results = {
  hexColors: [],
  rgbColors: [],
  rgbaColors: [],
  inlineStyles: [],
  styleSheets: [],
  legacyImports: [],
  themeProviders: [],
  reactMemo: [],
  useCallback: [],
  useMemo: [],
  flatLists: [],
  interactiveComponents: [],
  exports: {},
  imports: new Set()
};

const walk = (dir) => {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(walk(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      files.push(filePath);
    }
  }
  return files;
};

const files = walk(ROOT_DIR);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // 1. Theme & Design Token Audit
  if (/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g.test(content)) {
    const matches = content.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g);
    // filter out things like #FFFFFF if it's in a comment, but for audit we just collect
    results.hexColors.push({ file, count: matches.length, matches });
  }
  if (/rgb\(/g.test(content)) results.rgbColors.push({ file });
  if (/rgba\(/g.test(content)) results.rgbaColors.push({ file });
  if (/style=\{\{/g.test(content)) results.inlineStyles.push({ file });
  if (/StyleSheet\.create/g.test(content)) results.styleSheets.push({ file });
  
  // 7. Legacy Component Verification
  if (/src\/components\/ui/g.test(content)) results.legacyImports.push({ file });
  
  // 2. Theme Provider Audit
  if (/ThemeProvider/g.test(content) && content.includes('createContext')) {
    results.themeProviders.push({ file });
  }

  // 3. React Rendering Audit
  const memoMatch = content.match(/React\.memo\(/g);
  if (memoMatch) results.reactMemo.push({ file, count: memoMatch.length });
  
  const useCallbackMatch = content.match(/useCallback\(/g);
  if (useCallbackMatch) results.useCallback.push({ file, count: useCallbackMatch.length });

  const useMemoMatch = content.match(/useMemo\(/g);
  if (useMemoMatch) results.useMemo.push({ file, count: useMemoMatch.length });

  // 4. FlatList Audit
  if (/<FlatList/g.test(content)) {
    const initialNum = /initialNumToRender=\{/g.test(content);
    const windowSize = /windowSize=\{/g.test(content);
    const maxBatch = /maxToRenderPerBatch=\{/g.test(content);
    const removeClipped = /removeClippedSubviews=\{/g.test(content);
    const keyExt = /keyExtractor=\{/g.test(content);
    results.flatLists.push({ file, initialNum, windowSize, maxBatch, removeClipped, keyExt });
  }

  // 5. Accessibility Audit
  const interactives = content.match(/<(PrimaryButton|IconButton|FloatingActionButton|Pressable|TouchableOpacity)[^>]*>/g);
  if (interactives) {
    interactives.forEach(match => {
      const hasLabel = /accessibilityLabel/.test(match);
      const hasRole = /accessibilityRole/.test(match);
      results.interactiveComponents.push({ component: match.split(' ')[0].replace('<', ''), file, hasLabel, hasRole });
    });
  }

  // 8. Dead code audit prep
  const exportMatches = content.match(/export (const|function|class|interface|type) ([a-zA-Z0-9_]+)/g);
  if (exportMatches) {
    exportMatches.forEach(match => {
      const name = match.split(' ').pop();
      results.exports[name] = file;
    });
  }
  const importMatches = content.match(/import \{([^}]+)\}/g);
  if (importMatches) {
    importMatches.forEach(match => {
      const names = match.replace('import {', '').replace('}', '').split(',').map(n => n.trim());
      names.forEach(n => results.imports.add(n));
    });
  }
});

let unusedExports = [];
Object.keys(results.exports).forEach(exp => {
  if (!results.imports.has(exp)) {
    unusedExports.push(exp);
  }
});

fs.writeFileSync('d:/Projects/LifeOS/mobile/audit_report.json', JSON.stringify({
  hexColors: results.hexColors,
  rgbColors: results.rgbColors,
  rgbaColors: results.rgbaColors,
  inlineStyles: results.inlineStyles,
  styleSheets: results.styleSheets,
  legacyImports: results.legacyImports,
  themeProviders: results.themeProviders.length,
  reactMemo: results.reactMemo,
  useCallback: results.useCallback,
  useMemo: results.useMemo,
  flatLists: results.flatLists,
  interactiveComponentsCount: results.interactiveComponents.length,
  interactivesWithLabel: results.interactiveComponents.filter(c => c.hasLabel).length,
  unusedExportsCount: unusedExports.length
}, null, 2));

console.log("Audit complete. Results written to audit_report.json");
