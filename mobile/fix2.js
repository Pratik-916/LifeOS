const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const fixEmptyState = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  if (content.includes('actionTitle=')) {
    content = content.replace(/actionTitle=/g, 'actionLabel=');
    changed = true;
  }
  if (changed) fs.writeFileSync(filePath, content);
};

const fixGoalsBadges = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  if (content.match(/<CategoryChip[^>]*category={/)) {
    content = content.replace(/(<CategoryChip[^>]*?)category={([^}]+)}/g, '$1label={$2}');
    changed = true;
  }
  if (content.match(/<StatusBadge[^>]*status={/)) {
    content = content.replace(/(<StatusBadge[^>]*?)status={([^}]+)}/g, '$1label={$2}');
    changed = true;
  }
  if (content.match(/<PriorityBadge[^>]*priority={/)) {
    content = content.replace(/(<PriorityBadge[^>]*?)priority={([^}]+)}/g, '$1label={$2}');
    changed = true;
  }
  if (changed) fs.writeFileSync(filePath, content);
};

if (fs.existsSync('src/features/analytics')) walkDir('src/features/analytics', fixEmptyState);
if (fs.existsSync('src/features/habits')) walkDir('src/features/habits', fixEmptyState);
if (fs.existsSync('src/features/goals')) walkDir('src/features/goals', fixGoalsBadges);
