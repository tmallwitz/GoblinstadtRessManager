#!/usr/bin/env node
// Generated Node.js statusline for Claude Code
// Created: 2025-01-29
// Theme: detailed | Features: directory, git, model, context, usage, session, tokens, burnrate

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Read stdin
let inputData = '';
process.stdin.on('data', chunk => inputData += chunk);
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData);
    renderStatusLine(input);
  } catch (error) {
    console.error('Error parsing input:', error.message);
    process.exit(1);
  }
});

function execCommand(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      ...options
    }).trim();
  } catch {
    return '';
  }
}

function getMaxContext(modelName) {
  const name = modelName.toLowerCase();
  if (name.includes('opus')) return 200000;
  if (name.includes('sonnet')) return 200000;
  if (name.includes('haiku')) {
    if (name.includes('claude 3 haiku')) return 100000;
    return 200000;
  }
  return 200000;
}

function progressBar(pct, width = 10) {
  pct = Math.max(0, Math.min(100, parseInt(pct) || 0));
  const filled = Math.floor(pct * width / 100);
  const empty = width - filled;
  return '='.repeat(filled) + '-'.repeat(empty);
}

function formatTime(epoch) {
  const date = new Date(epoch * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function getGitBranch(cwd) {
  try {
    const gitDir = execCommand('git rev-parse --git-dir', { cwd });
    if (gitDir) {
      return execCommand('git branch --show-current', { cwd }) ||
             execCommand('git rev-parse --short HEAD', { cwd });
    }
  } catch {}
  return '';
}

function getContextUsage(input) {
  const { session_id, workspace, model } = input;
  if (!session_id) return null;

  const modelName = model?.display_name || 'Claude';
  const maxContext = getMaxContext(modelName);

  // Try to find session file in various locations
  const homeDir = os.homedir();
  const currentDir = workspace?.current_dir || workspace?.project_dir || process.cwd();

  // Normalize path for Windows
  const normalizedDir = currentDir
    .replace(/\\/g, '/')
    .replace(/^[A-Z]:/i, (match) => match.toLowerCase());

  // Create project identifier (remove home dir and sanitize)
  let projectId = normalizedDir
    .replace(homeDir.replace(/\\/g, '/'), '')
    .replace(/^\/+/, '')
    .replace(/[/:]/g, '-')
    .replace(/^-+/, '');

  // Try multiple session file locations
  const possiblePaths = [
    path.join(homeDir, '.claude', 'projects', `-${projectId}`, `${session_id}.jsonl`),
    path.join(homeDir, '.claude', 'projects', projectId, `${session_id}.jsonl`),
    path.join(homeDir, '.claude', 'sessions', `${session_id}.jsonl`)
  ];

  let sessionFile = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      sessionFile = p;
      break;
    }
  }

  if (!sessionFile) return null;

  try {
    const lines = fs.readFileSync(sessionFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .slice(-20);

    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        if (entry.message?.usage) {
          const { input_tokens = 0, cache_read_input_tokens = 0 } = entry.message.usage;
          const latestTokens = input_tokens + cache_read_input_tokens;

          if (latestTokens > 0) {
            const contextUsedPct = Math.floor(latestTokens * 100 / maxContext);
            const contextRemainingPct = 100 - contextUsedPct;
            return {
              remaining: contextRemainingPct,
              bar: progressBar(contextRemainingPct, 10)
            };
          }
        }
      } catch {}
    }
  } catch {}

  return null;
}

function getUsageData() {
  try {
    // Try npx ccusage first, then global ccusage
    let output = execCommand('npx ccusage@latest blocks --json 2>nul');
    if (!output) {
      output = execCommand('ccusage blocks --json 2>nul');
    }

    if (!output) return null;

    const data = JSON.parse(output);
    const activeBlock = data.blocks?.find(b => b.isActive);

    if (!activeBlock) return null;

    const result = {
      costUSD: activeBlock.costUSD,
      costPerHour: activeBlock.burnRate?.costPerHour,
      totalTokens: activeBlock.totalTokens,
      tokensPerMinute: activeBlock.burnRate?.tokensPerMinute,
      session: null
    };

    // Calculate session time
    const resetTime = activeBlock.usageLimitResetTime || activeBlock.endTime;
    const startTime = activeBlock.startTime;

    if (resetTime && startTime) {
      const startSec = Math.floor(new Date(startTime).getTime() / 1000);
      const endSec = Math.floor(new Date(resetTime).getTime() / 1000);
      const nowSec = Math.floor(Date.now() / 1000);

      const total = Math.max(1, endSec - startSec);
      const elapsed = Math.max(0, Math.min(total, nowSec - startSec));
      const sessionPct = Math.floor(elapsed * 100 / total);
      const remaining = Math.max(0, endSec - nowSec);

      const rh = Math.floor(remaining / 3600);
      const rm = Math.floor((remaining % 3600) / 60);
      const endHm = formatTime(endSec);

      result.session = {
        text: `${rh}h ${rm}m until reset at ${endHm} (${sessionPct}%)`,
        bar: progressBar(sessionPct, 10),
        pct: sessionPct
      };
    }

    return result;
  } catch {}
  return null;
}

function renderStatusLine(input) {
  const currentDir = (input.workspace?.current_dir || input.cwd || 'unknown')
    .replace(os.homedir(), '~');
  const modelName = input.model?.display_name || 'Claude';
  const modelVersion = input.model?.version;
  const ccVersion = input.version;
  const outputStyle = input.output_style?.name;

  const gitBranch = getGitBranch(input.workspace?.current_dir || process.cwd());
  const contextUsage = getContextUsage(input);
  const usageData = getUsageData();

  // Line 1: Core info
  let line1 = `📁 ${currentDir}`;
  if (gitBranch) line1 += `  🌿 ${gitBranch}`;
  line1 += `  🤖 ${modelName}`;
  if (modelVersion && modelVersion !== 'null') line1 += `  🏷️ ${modelVersion}`;
  if (ccVersion && ccVersion !== 'null') line1 += `  📟 v${ccVersion}`;
  if (outputStyle && outputStyle !== 'null') line1 += `  🎨 ${outputStyle}`;

  // Line 2: Context and session time
  let line2 = '';
  if (contextUsage) {
    line2 = `🧠 Context Remaining: ${contextUsage.remaining}% [${contextUsage.bar}]`;
  } else {
    line2 = '🧠 Context Remaining: TBD';
  }

  if (usageData?.session) {
    line2 += `  ⌛ ${usageData.session.text} [${usageData.session.bar}]`;
  }

  // Line 3: Cost and usage analytics
  let line3 = '';
  if (usageData) {
    if (usageData.costUSD != null) {
      line3 = `💰 $${usageData.costUSD.toFixed(2)}`;
      if (usageData.costPerHour != null) {
        line3 += ` ($${usageData.costPerHour.toFixed(2)}/h)`;
      }
    }

    if (usageData.totalTokens != null) {
      const tokensStr = usageData.tokensPerMinute != null
        ? `${usageData.totalTokens} tok (${Math.round(usageData.tokensPerMinute)} tpm)`
        : `${usageData.totalTokens} tok`;

      line3 += line3 ? `  📊 ${tokensStr}` : `📊 ${tokensStr}`;
    }
  }

  // Print all lines
  console.log(line1);
  if (line2) console.log(line2);
  if (line3) console.log(line3);
}
