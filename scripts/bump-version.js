const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Please provide a valid semantic version (e.g., 1.2.3)");
  process.exit(1);
}

console.log(`Bumping version to ${version}...`);

const updateJson = (filePath, key, value) => {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  data[key] = value;
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${filePath}`);
};

// Root package.json
updateJson('package.json', 'version', version);

// Frontend package.json
updateJson('frontend/package.json', 'version', version);

// Mobile package.json
updateJson('mobile/package.json', 'version', version);

// Mobile app.json (Expo)
const appJsonPath = path.resolve('mobile/app.json');
if (fs.existsSync(appJsonPath)) {
  const data = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  if (data.expo) {
    data.expo.version = version;
    
    // Automatically increment iOS buildNumber and Android versionCode based on semantic version
    const parts = version.split('.');
    const versionCode = parseInt(parts[0]) * 10000 + parseInt(parts[1]) * 100 + parseInt(parts[2]);
    
    if (data.expo.ios) data.expo.ios.buildNumber = String(versionCode);
    if (data.expo.android) data.expo.android.versionCode = versionCode;
  }
  fs.writeFileSync(appJsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated mobile/app.json`);
}

// Backend version
// In Django, we'll store version in a simple VERSION.txt
fs.writeFileSync(path.resolve('backend/VERSION.txt'), version, 'utf8');
console.log(`Updated backend/VERSION.txt`);

console.log("Version bump complete. Next steps:");
console.log("git add .");
console.log(`git commit -m "chore(release): v${version}"`);
console.log(`git tag v${version}`);
