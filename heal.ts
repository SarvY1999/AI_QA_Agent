import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic();
const BASE_URL = process.env.BASE_URL || 'https://citypulse.contentstackapps.com/';

// Maps fixture names (as used in test files) to their page object files
const FIXTURE_TO_PAGE: Record<string, string> = {
  homePage: 'pages/HomePage.ts',
  eventsPage: 'pages/EventsPage.ts',
  toursPage: 'pages/ToursPage.ts',
};

interface Failure {
  title: string;
  file: string;
  errorMessage: string;
}

function collectFailures(node: any, failures: Failure[]) {
  for (const spec of node.specs || []) {
    for (const test of spec.tests || []) {
      for (const result of test.results || []) {
        if (result.status === 'failed' && result.error) {
          failures.push({
            title: spec.title,
            file: spec.file || node.file || '',
            errorMessage: result.error.message || '',
          });
        }
      }
    }
  }
  for (const child of node.suites || []) {
    collectFailures(child, failures);
  }
}

function getPageObjectsForTestFile(testFile: string): string[] {
  if (!fs.existsSync(testFile)) return [];
  const content = fs.readFileSync(testFile, 'utf-8');
  return Object.entries(FIXTURE_TO_PAGE)
    .filter(([fixture]) => content.includes(fixture))
    .map(([, file]) => file)
    .filter(f => fs.existsSync(f));
}

function getPageUrlFromObject(pageObjectFile: string): string {
  const content = fs.readFileSync(pageObjectFile, 'utf-8');
  const match = content.match(/page\.goto\(['"]([^'"]+)['"]\)/);
  return match ? match[1] : '/';
}

async function takeAccessibilitySnapshot(url: string): Promise<string> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const snapshot = await page.accessibility.snapshot();
  await browser.close();
  return JSON.stringify(snapshot, null, 2);
}

async function healPageObject(filePath: string, errors: string[], snapshot: string, pageUrl: string): Promise<void> {
  const currentCode = fs.readFileSync(filePath, 'utf-8');

  console.log(`  🤖 Asking Claude to fix ${filePath}...`);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: `You are a Playwright test healer. You fix broken locators in TypeScript Playwright page object files.
You are given a broken file, the test error messages, and the current accessibility snapshot of the page.
Rules:
- Return ONLY the complete corrected TypeScript source code
- Do NOT wrap in markdown code fences
- Only fix broken locators — do not change logic, method names, or anything else
- Use the accessibility snapshot to identify the correct element roles, names, and attributes`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `These Playwright test errors occurred:\n\n${errors.map((e, i) => `Error ${i + 1}:\n${e}`).join('\n\n')}`,
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: `Page object file to fix (${filePath}):\n\n${currentCode}`,
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: `Current accessibility snapshot of the page at ${pageUrl}:\n\n${snapshot}\n\nReturn the corrected TypeScript code.`,
          },
        ],
      },
    ],
  });

  const fixed = response.content[0].type === 'text' ? response.content[0].text.trim() : null;

  if (!fixed) {
    console.log(`  ⚠️  No fix returned for ${filePath}`);
    return;
  }

  // Strip markdown fences if Claude accidentally included them
  const cleaned = fixed.replace(/^```(?:typescript)?\n?/, '').replace(/\n?```$/, '').trim();

  fs.writeFileSync(filePath, cleaned + '\n');
  console.log(`  ✅ Healed: ${filePath}`);
}

async function main() {
  const resultsPath = 'test-results.json';

  if (!fs.existsSync(resultsPath)) {
    console.error('❌ test-results.json not found. Run tests first:\n   npx playwright test');
    process.exit(1);
  }

  const json = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const failures: Failure[] = [];

  for (const suite of json.suites || []) {
    collectFailures(suite, failures);
  }

  if (!failures.length) {
    console.log('✅ No failures to heal!');
    return;
  }

  console.log(`\n🔍 Found ${failures.length} failing test(s)\n`);

  // Group failures by test file
  const byTestFile = new Map<string, Failure[]>();
  for (const f of failures) {
    if (!byTestFile.has(f.file)) byTestFile.set(f.file, []);
    byTestFile.get(f.file)!.push(f);
  }

  const healed = new Set<string>();

  for (const [testFile, testFailures] of byTestFile) {
    console.log(`📋 ${path.relative(process.cwd(), testFile)}`);
    testFailures.forEach(f => console.log(`   ✗ ${f.title}`));

    const pageObjects = getPageObjectsForTestFile(testFile);

    if (!pageObjects.length) {
      console.log(`   ⚠️  No page objects found — skipping\n`);
      continue;
    }

    for (const pageObjectFile of pageObjects) {
      if (healed.has(pageObjectFile)) continue;

      const relativeUrl = getPageUrlFromObject(pageObjectFile);
      const fullUrl = new URL(relativeUrl, BASE_URL).href;

      console.log(`\n  📸 Snapshotting ${fullUrl}...`);
      const snapshot = await takeAccessibilitySnapshot(fullUrl);

      await healPageObject(
        pageObjectFile,
        testFailures.map(f => f.errorMessage),
        snapshot,
        fullUrl
      );
      healed.add(pageObjectFile);
    }
    console.log();
  }

  console.log('✨ Healing complete! Run tests again to verify:\n   npx playwright test\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
