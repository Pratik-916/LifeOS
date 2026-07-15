const fs = require('fs');
const path = require('path');

// Helper to walk directory
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

// 1. Fix EmptyState icon prop
const fixEmptyStateIcon = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  if (content.match(/icon={<Icon name="([^"]+)"[^>]*>}/)) {
    content = content.replace(/icon={<Icon name="([^"]+)"[^>]*>}/g, 'icon="$1"');
    changed = true;
  }
  if (content.match(/icon={<([A-Za-z]+)\s+size=\{48\}[^>]*>}/)) {
    content = content.replace(/icon={<([A-Za-z]+)\s+size=\{48\}[^>]*>}/g, 'icon="$1"');
    changed = true;
  }
  if (changed) fs.writeFileSync(filePath, content);
};

// 2. Fix goals imports
const fixGoalsImports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("from '../../design-system'")) {
    content = content.replace(/from '\.\.\/\.\.\/design-system'/g, "from '../../../design-system'");
    fs.writeFileSync(filePath, content);
  }
};

// 3. Fix HabitEditorScreen Button isLoading -> loading
const fixHabitEditor = () => {
  const file = 'src/features/habits/screens/HabitEditorScreen.tsx';
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('isLoading={')) {
    content = content.replace(/isLoading={/g, 'loading={');
    fs.writeFileSync(file, content);
  }
};

// 4. Fix IconProps in IconProvider.tsx
const fixIconProps = () => {
  const file = 'src/design-system/icons/IconProvider.tsx';
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('fill?: string;')) {
    content = content.replace(/color\?: string;/, 'color?: string;\n  fill?: string;');
    fs.writeFileSync(file, content);
  }
};

// 5. Fix MemoryEditorScreen Input -> TextField
const fixMemoryEditor = () => {
  const file = 'src/features/journey/screens/MemoryEditorScreen.tsx';
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(' Input')) {
    content = content.replace(/\bInput\b/g, 'TextField');
    fs.writeFileSync(file, content);
  }
};

// Run fixes
console.log('Running fixes...');
if (fs.existsSync('src/features/analytics')) walkDir('src/features/analytics', fixEmptyStateIcon);
if (fs.existsSync('src/features/habits')) walkDir('src/features/habits', fixEmptyStateIcon);
if (fs.existsSync('src/features/goals')) walkDir('src/features/goals', fixGoalsImports);

fixHabitEditor();
fixIconProps();
fixMemoryEditor();
console.log('Fixes completed.');
