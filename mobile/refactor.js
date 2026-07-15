const fs = require('fs');
const path = require('path');

const dir = 'src/features/analytics';

function walk(currentDir) {
  let results = [];
  const list = fs.readdirSync(currentDir);
  list.forEach(file => {
    const fullPath = path.join(currentDir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Track new imports
  let dsImports = new Set();
  
  // Replace <Typography variant="...">...
  // Since we can't reliably replace just the closing tag with regex if not matching the whole block,
  // let's do a simple string replace. There are no nested Typography components.
  // Actually, we can just replace `<Typography` with the correct tag, and `</Typography>` with the correct closing tag, if we assume there is only one variant per file? NO, multiple variants exist.
  // Let's use a regex to find all <Typography> and </Typography> and replace them one by one.
  // A better way: match opening tag, extract variant, replace tag name. We can't replace the closing tag easily without a parser.
  // BUT we can just write a quick state machine:
  
  let newContent = '';
  let i = 0;
  let tagStack = []; // stores the tag name we used (e.g. 'HeadingLG')
  
  while (i < content.length) {
    if (content.startsWith('<Typography', i)) {
      // Find end of opening tag
      let endTag = content.indexOf('>', i);
      let isSelfClosing = content[endTag - 1] === '/';
      let tagStr = content.substring(i, endTag + 1);
      
      let variantMatch = tagStr.match(/variant=["'](.*?)["']/);
      let variant = variantMatch ? variantMatch[1] : 'body';
      
      let newTag = 'BodyMD';
      if (variant === 'h1') newTag = 'HeadingXL';
      if (variant === 'h2') newTag = 'HeadingLG';
      if (variant === 'h3') newTag = 'HeadingMD';
      if (variant === 'h4') newTag = 'HeadingSM';
      if (variant === 'body') newTag = 'BodyMD';
      if (variant === 'caption') newTag = 'Caption';
      
      dsImports.add(newTag);
      
      if (!isSelfClosing) {
        tagStack.push(newTag);
      }
      
      let newOpeningTag = tagStr.replace('Typography', newTag).replace(/\s*variant=["'].*?["']/, '');
      newContent += newOpeningTag;
      i = endTag + 1;
    } else if (content.startsWith('</Typography>', i)) {
      let popTag = tagStack.pop() || 'BodyMD'; // Fallback just in case
      newContent += `</${popTag}>`;
      i += '</Typography>'.length;
    } else {
      newContent += content[i];
      i++;
    }
  }
  
  content = newContent;

  // Replace Card -> PrimaryCard
  if (content.includes('<Card')) {
    content = content.replace(/<Card/g, '<PrimaryCard');
    content = content.replace(/<\/Card>/g, '</PrimaryCard>');
    dsImports.add('PrimaryCard');
  }

  // Handle lucide-react-native -> design-system Icon
  // E.g. import { Zap, Activity } from 'lucide-react-native';
  let lucideMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react-native['"];?/);
  if (lucideMatch) {
    dsImports.add('Icon');
    let icons = lucideMatch[1].split(',').map(s => s.trim());
    // We need to replace <Zap ... /> with <Icon name="Zap" ... />
    // But wait, what if it's passed as a prop: `icon={Zap}`?
    // If it's passed as a prop, they might be expecting a React component.
    // In our IconProvider, `Icon` takes a `name` prop (string).
    // Let's replace `icon={Zap}` with `icon="Zap"` in the code?
    // Actually, `StatCard` currently accepts `LucideIcon`. We need to update `StatCard` to accept `string`.
    
    // For now, let's just replace JSX <Zap /> -> <Icon name="Zap" />
    icons.forEach(icon => {
      // JSX usage: <Zap size={16} ... /> -> <Icon name="Zap" size={16} ... />
      let regexJSX = new RegExp(`<${icon}(\\s|>)`, 'g');
      content = content.replace(regexJSX, `<Icon name="${icon}"$1`);
      let regexJSXClose = new RegExp(`</${icon}>`, 'g');
      content = content.replace(regexJSXClose, `</Icon>`);
      
      // Prop usage: icon={Zap} -> icon="${icon}"
      let regexProp = new RegExp(`icon=\\{${icon}\\}`, 'g');
      content = content.replace(regexProp, `icon="${icon}"`);
    });
    
    // Remove lucide import
    content = content.replace(lucideMatch[0], '');
  }

  // Replace react-native Text, TouchableOpacity if present
  if (content.includes('<Text')) {
    content = content.replace(/<Text/g, '<BodyMD');
    content = content.replace(/<\/Text>/g, '</BodyMD>');
    dsImports.add('BodyMD');
  }
  if (content.includes('<TouchableOpacity')) {
    content = content.replace(/<TouchableOpacity/g, '<Button variant="ghost"'); // rough guess
    content = content.replace(/<\/TouchableOpacity>/g, '</Button>');
    dsImports.add('Button');
  }

  // Update imports: remove old Typography and Card imports
  content = content.replace(/import\s+\{\s*Typography\s*\}\s+from\s+['"].*?components\/ui\/Typography['"];?\n?/g, '');
  content = content.replace(/import\s+\{\s*Card\s*\}\s+from\s+['"].*?components\/ui\/Card['"];?\n?/g, '');
  content = content.replace(/import\s+\{\s*EmptyState\s*\}\s+from\s+['"].*?components\/ui\/EmptyState['"];?\n?/g, () => {
    dsImports.add('EmptyState');
    return '';
  });
  
  // Clean up react-native imports
  // Remove Text, TouchableOpacity from react-native import
  let rnImportMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"];?/);
  if (rnImportMatch) {
    let rnImports = rnImportMatch[1].split(',').map(s => s.trim());
    rnImports = rnImports.filter(i => i !== 'Text' && i !== 'TouchableOpacity');
    if (rnImports.length > 0) {
      content = content.replace(rnImportMatch[0], `import { ${rnImports.join(', ')} } from 'react-native';`);
    } else {
      content = content.replace(rnImportMatch[0], '');
    }
  }

  // Determine relative path to design-system
  // depth: from src/features/analytics/components -> src/design-system is ../../../design-system
  // from src/features/analytics/screens -> src/design-system is ../../../design-system
  let relativeDsPath = '../../../design-system';

  if (dsImports.size > 0) {
    let dsImportStr = `import { ${Array.from(dsImports).join(', ')} } from '${relativeDsPath}';\n`;
    // Insert after React import
    content = content.replace(/(import\s+React.*?;\n)/, `$1${dsImportStr}`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
