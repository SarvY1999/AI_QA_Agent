# AI QA Agent — Playwright Test Suite

Automated end-to-end test suite for [CityPulse](https://citypulse.contentstackapps.com/) built with [Playwright](https://playwright.dev/).

---

## What is this project?

**AI QA Agent** is an automated quality assurance project that uses [Playwright](https://playwright.dev/) to run end-to-end browser tests against the **CityPulse** web application.

### What is CityPulse?

CityPulse (`https://citypulse.contentstackapps.com/`) is a travel and city exploration platform that helps users discover things to do in cities across India. It provides:

- **City Tours** — Guided tours such as the Evening Ganga Aarti Boat Ride (Varanasi) and Kerala Backwaters Escape.
- **Cultural Events** — Local festivals and experiences like the Jaipur Literature Festival, Colors of India Cultural Night, and Yoga & Meditation Festival.
- **Restaurants** — Curated dining listings from street food to fine dining.
- **Hotels** — Accommodation recommendations for travellers.

The homepage features a hero section with a search bar, stat highlights (7000+ destinations, 20,000+ travel guides), and quick-access activity cards linking to each section.

### What does this test suite do?

The test suite validates that the CityPulse application is working correctly from a user's perspective — loading pages, rendering content, and navigating between sections. It is not a unit test suite; it tests the **real, live application running in a browser**, catching regressions that code-level tests would miss.

Tests cover:

| File | What it tests |
|---|---|
| `citypulse.spec.ts` | Homepage loads: title, headings, hero buttons, and search bar are visible |
| `navigation.spec.ts` | Navbar links are present, clicking them lands on the correct pages, logo returns to homepage |
| `events.spec.ts` | Events page loads with correct heading, all 3 event cards are visible with their titles and action buttons |
| `search.spec.ts` | Search returns results for a valid query, shows a "no results" message for unknown terms, and clears correctly |
| `booking.spec.ts` | Clicking "Book Now" opens the booking modal with the correct form fields; clicking "Learn More" opens the event detail modal; both modals close correctly |
| `example.spec.ts` | Baseline smoke tests for the homepage title and hero heading |

### Why Playwright?

Playwright was chosen because it:
- Runs real browsers (Chromium, Firefox, WebKit) so tests reflect actual user experience
- Has a built-in test runner, assertions, and HTML reporter
- Supports CI/CD out of the box with GitHub Actions
- Provides a CLI (`playwright-cli`) for live browser inspection and locator generation

---

## How We Built It

### Tech Stack

| Tool | Version | Role |
|---|---|---|
| [Node.js](https://nodejs.org/) | v18+ | Runtime environment |
| [TypeScript](https://www.typescriptlang.org/) | via `@types/node` | Language used for all test files and config |
| [@playwright/test](https://playwright.dev/) | ^1.59.1 | Test runner, browser automation, and assertions |
| [@playwright/cli](https://www.npmjs.com/package/@playwright/cli) | ^0.1.11 | Live browser inspection and locator generation |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline for automated test runs |
| [Claude Code](https://claude.ai/code) | — | AI assistant used to build and generate the test suite |
| [Claude API (claude-sonnet-4-6)](https://anthropic.com) | — | Powers the self-healing script — analyzes failures and fixes broken locators |

### How the tests were written

1. **Live browser inspection** — We used `playwright-cli` to open the CityPulse site in a real browser and capture page snapshots. This gave us the exact element structure, roles, and text content without guessing.

2. **Page Object Model (POM)** — All page locators and actions are encapsulated in classes under `pages/` (e.g. `HomePage`, `EventsPage`, `ToursPage`). Tests import these classes and interact through them, so locator changes only need to be made in one place rather than across every test file.

3. **Fixtures** — A custom `fixtures/index.ts` extends Playwright's base `test` with typed page object fixtures (`homePage`, `eventsPage`, `toursPage`). Tests receive page objects via destructuring instead of manually instantiating them, keeping tests clean and setup logic in one place.

4. **Locator strategy** — All locators use Playwright's semantic role-based selectors (`getByRole`, `getByPlaceholder`) rather than CSS classes or XPaths. This makes tests resilient to styling changes and aligned with how users perceive the page.

5. **Base URL in config** — Instead of hardcoding `https://citypulse.contentstackapps.com/` in every test, the URL is set once in `playwright.config.ts`. Tests use relative paths like `page.goto('/')`, making it trivial to point the suite at a staging or local environment.

6. **Test isolation** — Each test navigates to its own page from scratch. There is no shared state between tests, so they can run in parallel without interfering with each other (`fullyParallel: true` in config).

7. **CI integration** — The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the full suite on every push and pull request to `main`, with retries enabled on CI to handle flakiness from network conditions.

8. **Tracing on failure** — `trace: 'on-first-retry'` is enabled in the config. When a test fails and is retried on CI, Playwright records a full trace (DOM snapshots, network, console) that can be inspected with `npx playwright show-trace`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v8 or later

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps
```

---

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test tests/citypulse.spec.ts
```

### Run in headed mode (see the browser)

```bash
npx playwright test --headed
```

### Run in UI mode (interactive)

```bash
npx playwright test --ui
```

---

## AI Self-Healing Tests

If tests fail due to a locator change (e.g. a heading or button was renamed), the heal script automatically fixes the broken locators using Claude AI.

### How it works

1. Run the tests — failures are written to `test-results.json`
2. Run the heal script — it opens a real browser, takes an accessibility snapshot of the affected page, and sends the broken page object + snapshot to Claude
3. Claude identifies the correct locator from the live page and rewrites the page object file
4. Run the tests again to verify the fix

### Usage

```bash
# 1. Run tests (generates test-results.json)
npm test

# 2. Heal any failures
npm run heal

# 3. Re-run tests to verify
npm test
```

### Setup

Add your Anthropic API key to `.env`:

```
ANTHROPIC_API_KEY=your_api_key_here
```

---

## Viewing the Report

After a test run, open the HTML report:

```bash
npx playwright show-report
```

The report is saved to `playwright-report/`.

---

## Project Structure

```
AI_QA_Agent/
├── pages/
│   ├── HomePage.ts          # Locators and actions for the homepage
│   ├── EventsPage.ts        # Locators and actions for the events page
│   └── ToursPage.ts         # Locators and actions for the tours page
├── fixtures/
│   └── index.ts             # Custom test fixtures that inject page objects
├── heal.ts                  # AI self-healing script — fixes broken locators using Claude
├── tests/
│   ├── citypulse.spec.ts    # Homepage load & visibility tests
│   ├── navigation.spec.ts   # Navbar links & page routing tests
│   ├── events.spec.ts       # Events page content & card tests
│   ├── search.spec.ts       # Search bar interaction & results tests
│   ├── booking.spec.ts      # Book Now & Learn More modal flow tests
│   └── example.spec.ts      # Baseline smoke tests
├── playwright.config.ts     # Playwright configuration (baseURL, browser, retries)
├── .env                     # Environment variables (BASE_URL)
├── package.json
└── .github/
    └── workflows/
        └── playwright.yml   # CI pipeline (runs on push/PR to main)
```

---

## Configuration

The base URL is set in `playwright.config.ts`:

```ts
use: {
  baseURL: 'https://citypulse.contentstackapps.com/',
}
```

All `page.goto('/')` calls in tests resolve against this URL. To test a different environment, update `baseURL` in the config or pass it via environment variable.

---

## CI/CD

Tests run automatically on every push or pull request to `main`/`master` via GitHub Actions. The workflow:

1. Checks out the repo
2. Installs Node.js (LTS)
3. Runs `npm ci`
4. Installs Playwright browsers
5. Runs `npx playwright test`
6. Uploads the HTML report as an artifact (retained for 30 days)

---

## Author

Sarvesh Yadav
