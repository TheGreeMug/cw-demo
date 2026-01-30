import { chromium } from '@playwright/test';

export default async function globalSetup(config) {
  const baseURL =
    config.projects[0]?.use?.baseURL || config.use?.baseURL || 'http://localhost:3000';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const email = process.env.E2E_EMAIL || 'test@e2e.com';
  const password = process.env.E2E_PASSWORD || 'test';

  await page.goto(baseURL);
  await page.getByPlaceholder('Enter Your Email').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByPlaceholder('Enter Your Email').fill(email);
  await page.getByPlaceholder('Enter Your Password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.locator('#sidebar-new-chat-button').waitFor({ state: 'visible', timeout: 15000 });

  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}
