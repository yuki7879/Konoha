import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const gitExe = '"C:\\Program Files\\Git\\cmd\\git.exe"';

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    const out = execSync(cmd, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 15000,
      env: {
        ...process.env,
        GIT_TERMINAL_PROMPT: '0',
        GCM_INTERACTIVE: 'never',
      },
    });
    if (out) console.log(out);
    return out;
  } catch (err) {
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return null;
  }
}

const commitMsg = process.argv[2] || 'feat: complete block C002 - core stabilization, runtime store, ticket mutex, and role pings';

console.log('[Git Sync] Bắt đầu gom code và đẩy lên GitHub...');
run(`${gitExe} status -s`);
run(`${gitExe} add .`);
run(`${gitExe} commit -m "${commitMsg}"`);
run(`${gitExe} pull --rebase origin main`);
run(`${gitExe} push origin main`);
console.log('[Git Sync] ✅ Hoàn tất đẩy code lên GitHub!');
process.exit(0);
