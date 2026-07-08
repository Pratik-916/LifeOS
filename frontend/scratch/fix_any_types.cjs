const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(fullPath, content);
}

replaceFile('src/features/goals/api/goals.ts', [
  [/apiClient\./g, 'axiosInstance.'],
]);

replaceFile('src/components/GoalStatistics.tsx', [
  [/import \{ Skeleton \} from '\.\.\/components\/ui\/Skeleton';/g, "import { Skeleton } from './ui/Skeleton';"],
]);

replaceFile('src/hooks/useJourneyData.ts', [
  [/milestones\.filter\(\(m\) =>/g, 'milestones.filter((m: any) =>'],
  [/milestones\.filter\(m =>/g, 'milestones.filter((m: any) =>'],
]);

replaceFile('src/pages/Goals.tsx', [
  [/itemsPerPage=\{10\}\n/g, ''],
]);

console.log('Fixed more types');
