# pw-demo

Playwright tests for Open WebUI chat flows and API payload checks.

Test info for t1/2/3/4/9 is in `tests/INFO.md`.

## How to run tests

```sh
npm install
npx playwright install
```

Start Open WebUI locally (expected at `http://localhost:3000`), then run:

```sh
npx playwright test
npx playwright test --headed --grep @local --project=chromium --ui
```

## View results

- HTML report: `npx playwright show-report` (reads `playwright-report`)
- JUnit report: `junit.xml`

## Notes

- Base URL is `http://localhost:3000` (see `playwright.config.js`).
- Screenshots/videos are saved on failures (default `test-results` folder).
