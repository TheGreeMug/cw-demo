import { test as base, expect } from '@playwright/test';

export class WebUIPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.email = page.getByPlaceholder('Enter Your Email');
    this.password = page.getByPlaceholder('Enter Your Password');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.newChatButton = page.locator('#sidebar-new-chat-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.email.waitFor({ state: 'visible', timeout: 15000 });
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }

  async news() {
    await this.page.getByRole('button', { name: 'Okay, Let\'s Go ' }).click();
  }

  async waitForNewChat(timeout = 5000) {
    await this.newChatButton.waitFor({ state: 'visible', timeout });
  }
}

export const test = base.extend({
  webui: async ({ page }, use) => {
    const webui = new WebUIPage(page);
    await use(webui);
  },
});

export { expect };
