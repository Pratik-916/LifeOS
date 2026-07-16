const fs = require('fs');
const path = require('path');

const requiredVars = {
  backend: [
    'DJANGO_SECRET_KEY',
    'DEBUG',
  ],
  frontend: [
    'VITE_API_URL',
  ],
  mobile: [
    'EXPO_PUBLIC_API_URL',
  ]
};

const checkEnv = (type, vars, envPath) => {
  let hasErrors = false;
  let content = '';

  try {
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');
    }
  } catch (err) {
    console.warn(`Could not read ${envPath}, relying on process.env`);
  }

  console.log(`\nValidating ${type} environment...`);
  
  vars.forEach(v => {
    // Check if it exists in process.env OR in the local .env file
    const inProcess = process.env[v] !== undefined;
    const inEnvFile = content.includes(`${v}=`);
    
    if (!inProcess && !inEnvFile) {
      console.error(`❌ Missing required variable: ${v}`);
      hasErrors = true;
    } else {
      console.log(`✅ Found: ${v}`);
    }
  });

  return hasErrors;
};

const main = () => {
  const isCI = process.env.CI === 'true';
  console.log(`Running environment validation (CI: ${isCI})`);
  
  let failed = false;
  
  failed = checkEnv('Backend', requiredVars.backend, path.resolve('backend/.env')) || failed;
  failed = checkEnv('Frontend', requiredVars.frontend, path.resolve('frontend/.env')) || failed;
  failed = checkEnv('Mobile', requiredVars.mobile, path.resolve('mobile/.env')) || failed;

  if (failed) {
    console.error("\n❌ Environment validation failed. Please provide missing variables.");
    process.exit(1);
  } else {
    console.log("\n✅ Environment validation passed.");
    process.exit(0);
  }
};

main();
