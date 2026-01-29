import {test, expect} from '@playwright/test';


test("@smoke Test1 - Login Page - Valid Credentials", async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    const elem = await page.locator('#username');
    console.log("Navigated to login page" + elem);
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', {name: 'Login'}).click();
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
});


test("@quarantine Test2 - Play With The Table", async ({page}) => {
    // await page.goto('https://the-internet.herokuapp.com/login');
    // await page.getByLabel('Username').fill('tomsmith');
    // await page.getByLabel('Password').fill('SuperSecretPassword!');
    // await page.getByRole('button', {name: 'Login'}).click();
    // await expect(page.getByText('You logged into a secure area!')).toBeVisible();

    await page.goto("https://the-internet.herokuapp.com/tables");
    const table1 = page.locator('#table1');
    const t1r1sort = page.locator('#table1 > thead > tr > th:nth-child(1)');
    await t1r1sort.click();
    await t1r1sort.click();
    await t1r1sort.click();
    await t1r1sort.click();
    await t1r1sort.click();

    const t1r1cell2 = table1.locator('tbody > tr:nth-child(1) > td:nth-child(2)');
    await expect(t1r1cell2).toHaveText('Franka');

    // Add waits at the end of the test
    // Wait for the table to be visible
    await table1.waitFor();

    // Wait for a specific cell to be visible
    await t1r1cell2.waitFor();

    // Optional: Add a timeout for debugging purposes
    await page.waitForTimeout(2000); // Wait for 2 seconds

    await expect(t1r1cell2).toHaveText('Franka');

    // Wait for the table to be visible
    await table1.waitFor({ state: 'visible' });

    // Wait for a specific cell to be visible
    await t1r1cell2.waitFor({ state: 'visible' });

    // Wait for the table header to disappear (example)
    await t1r1sort.waitFor({ state: 'hidden' });

    // Optional: Add a timeout for debugging purposes
    await page.waitForTimeout(2000); // Wait for 2 seconds

    // present in dom but not visible (detached = not present in dom)
    await table1.waitFor({ state: 'attached' });

    // Wait for a specific condition
    await page.waitForFunction(() => document.querySelector('#table1').innerText.includes('Franka'));
});