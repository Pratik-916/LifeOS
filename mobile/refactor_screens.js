const fs = require('fs');
const path = require('path');

const files = [
  'src/features/journey/screens/JourneyScreen.tsx',
  'src/features/journey/screens/JourneyStatisticsScreen.tsx',
  'src/features/journey/screens/MemoryDetailsScreen.tsx',
  'src/features/journey/screens/MemoryEditorScreen.tsx',
  'src/features/journey/screens/MemorySearchScreen.tsx'
];

files.forEach(file => {
  const filePath = path.join('d:/Projects/LifeOS/mobile', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Typography usages
  content = content.replace(/<Typography\s+variant="h1"([^>]*)>/g, '<HeadingXL$1>');
  content = content.replace(/<Typography\s+variant="h2"([^>]*)>/g, '<HeadingLG$1>');
  content = content.replace(/<Typography\s+variant="h3"([^>]*)>/g, '<HeadingMD$1>');
  content = content.replace(/<Typography\s+variant="body"([^>]*)>/g, '<BodyMD$1>');
  content = content.replace(/<Typography\s+variant="caption"([^>]*)>/g, '<Caption$1>');
  content = content.replace(/<\/Typography>/g, (match, offset, fullString) => {
    // Determine which tag was opened by looking backwards.
    // This is naive but works if nested properly without identical inner text.
    // Let's just do it simpler: we replace the opening tag, so let's match the closing tags by just matching a regex that doesn't care.
    // Wait, regex lookbehind for nearest opening tag is hard. 
    // Let's replace </Typography> dynamically if we can. Actually, we can just replace all Typography tags globally.
    return match; // Will do below instead.
  });

  // A safer approach to Typography:
  content = content.replace(/<Typography([^>]*)variant="h1"([^>]*)>(.*?)<\/Typography>/gs, '<HeadingXL$1$2>$3</HeadingXL>');
  content = content.replace(/<Typography([^>]*)variant="h2"([^>]*)>(.*?)<\/Typography>/gs, '<HeadingLG$1$2>$3</HeadingLG>');
  content = content.replace(/<Typography([^>]*)variant="h3"([^>]*)>(.*?)<\/Typography>/gs, '<HeadingMD$1$2>$3</HeadingMD>');
  content = content.replace(/<Typography([^>]*)variant="body"([^>]*)>(.*?)<\/Typography>/gs, '<BodyMD$1$2>$3</BodyMD>');
  content = content.replace(/<Typography([^>]*)variant="caption"([^>]*)>(.*?)<\/Typography>/gs, '<Caption$1$2>$3</Caption>');

  // Also catch self-closing (though Typography is rarely self-closing)

  // Replace react-native Text with BodyMD
  content = content.replace(/<Text([^>]*)>(.*?)<\/Text>/gs, '<BodyMD$1>$2</BodyMD>');
  
  // Remove react-native Text, TouchableOpacity, add Pressable if needed
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"];?/g, (m, p1) => {
      let imports = p1.split(',').map(i => i.trim()).filter(i => i);
      imports = imports.filter(i => i !== 'Text' && i !== 'TouchableOpacity');
      if (content.includes('<Pressable') && !imports.includes('Pressable')) {
          imports.push('Pressable');
      }
      return `import { ${imports.join(', ')} } from 'react-native';`;
  });

  // Remove Typography import
  content = content.replace(/import\s+\{\s*Typography\s*\}\s+from\s+['"][^'"]+Typography['"];?\n?/g, '');

  // Add design system import if needed
  const dsImports = ['HeadingXL', 'HeadingLG', 'HeadingMD', 'BodyMD', 'Caption', 'Icon', 'FloatingActionButton', 'IconButton'];
  const neededImports = dsImports.filter(imp => content.includes(`<${imp}`) || content.includes(` ${imp} `));
  if (neededImports.length > 0) {
      if (content.includes('../../../design-system')) {
         // It might already have imports
      } else {
         content = content.replace(/(import\s+.*?from\s+['"]react-native['"];?)/, `$1\nimport { ${neededImports.join(', ')} } from '../../../design-system';`);
      }
  }

  // Replace TouchableOpacity with Pressable
  content = content.replace(/<TouchableOpacity/g, '<Pressable');
  content = content.replace(/<\/TouchableOpacity>/g, '</Pressable>');

  // Replace Lucide icons
  const lucideRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react-native['"];?\n?/g;
  let match;
  let iconReplacements = [];
  while ((match = lucideRegex.exec(content)) !== null) {
      const icons = match[1].split(',').map(i => i.trim()).filter(i => i);
      icons.forEach(icon => {
          let actualIcon = icon;
          let alias = icon;
          if (icon.includes(' as ')) {
              actualIcon = icon.split(' as ')[0].trim();
              alias = icon.split(' as ')[1].trim();
          }
          iconReplacements.push({ name: actualIcon, alias: alias });
      });
  }
  content = content.replace(lucideRegex, '');
  
  iconReplacements.forEach(({name, alias}) => {
      const regex = new RegExp(`<${alias}\\b([^>]*)>`, 'g');
      content = content.replace(regex, (m, p1) => {
          return `<Icon name="${name}"${p1} />`;
      });
      // Handle closing tags if any
      const regexClosed = new RegExp(`</${alias}>`, 'g');
      content = content.replace(regexClosed, ``);
  });

  // Additional fixes for JourneyScreen specific components
  if (file.includes('JourneyScreen.tsx')) {
      content = content.replace(/<IconButton\s+icon=\{\s*<Icon\s+name="([^"]+)"([^>]*)\/>\s*\}/g, '<IconButton leftIcon="$1"');
      content = content.replace(/<FloatingActionButton([^>]*)>/g, (match) => {
        // We know it was a Pressable before with Plus, but the code had `<TouchableOpacity...><Plus/></TouchableOpacity>`
        return match;
      });
      
      // Specifically fix the absolute button
      content = content.replace(/<Pressable[^>]*className="absolute bottom-6 right-6[^>]*>[\s\n]*<Icon name="Plus"[^>]*\/>[\s\n]*<\/Pressable>/, `<FloatingActionButton leftIcon="Plus" onPress={() => navigation.navigate('MemoryEditor', {})} />`);
  }

  if (file.includes('MemoryEditorScreen.tsx')) {
      content = content.replace(/<Pressable className="bg-gray-100 h-32 rounded-xl items-center justify-center border-2 border-dashed border-gray-300">[\s\n]*<Icon name="Image"[^>]*\/>[\s\n]*<Caption([^>]*)>(.*?)<\/Caption>[\s\n]*<\/Pressable>/, `<Pressable className="bg-gray-100 h-32 rounded-xl items-center justify-center border-2 border-dashed border-gray-300">\n          <Icon name="Image" size={32} color="#9CA3AF" />\n          <Caption$1>$2</Caption>\n        </Pressable>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Done");
