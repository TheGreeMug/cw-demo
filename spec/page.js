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
    await this.page.keyboard.press('Enter');

  }

  async news() {
    await this.page.getByRole('button', { name: 'Okay, Let\'s Go ' }).click();
  }

  async waitForNewChat(timeout = 5000) {
    await this.newChatButton.waitFor({ state: 'visible', timeout });
  }

  async sendMessageAndExpectReply(
    sentMessage,
    receivedMessage,
    { userMessageIndex = 0, replyIndex = 0, timeout = 15000 } = {}
  ) {
    const editor = this.page.locator('#chat-input');
    const messages = this.page.locator('#messages-container');

    await editor.click();
    await this.page.keyboard.type(sentMessage);
    await this.page.keyboard.press('Enter');

    await expect(messages.locator('.user-message').nth(userMessageIndex)).toContainText(sentMessage, { timeout });
    const reply = messages.locator('.chat-assistant').nth(replyIndex);
    await expect(reply).toBeVisible({ timeout });
    await expect(reply).toContainText(receivedMessage, { timeout });
  }

  async deleteFirstChat(timeout = 5000) {
    const openSidebar = this.page.locator('button[aria-label="Open Sidebar"]');
    const chats = this.page.locator('#sidebar-chat-item');

    await openSidebar.click();
    const before = await chats.count();
    expect(before).toBeGreaterThan(0);

    await this.page
      .locator('#sidebar-chat-group')
      .first()
      .locator('button[aria-label="Chat Menu"]')
      .click();
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(this.page.getByText('Delete chat?')).toBeVisible({ timeout });
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await expect(chats).toHaveCount(before - 1, { timeout });
  }

  async waitForStableMessageText(
    locator,
    { stableForMs = 3000, intervalMs = 1000, timeout = 15000 } = {}
  ) {
    await locator.waitFor({ state: 'visible', timeout });

    const start = Date.now();
    let lastText = null;
    let stableMs = 0;

    while (Date.now() - start < timeout) {
      const text = await locator.innerText();

      if (text === lastText) {
        stableMs += intervalMs;
        if (stableMs >= stableForMs) {
          return text;
        }
      } else {
        stableMs = 0;
        lastText = text;
      }

      await this.page.waitForTimeout(intervalMs);
    }

    throw new Error(`Message text did not stabilize within ${timeout}ms`);
  }
}

export const test = base.extend({
  webui: async ({ page }, use) => {
    const webui = new WebUIPage(page);
    await use(webui);
  },
});

export { expect };
