import { it } from 'node:test';
import { test, expect } from '../spec/page';

test( '@local test1 - teach the webui page', async ( { page, webui } ) => {
    await webui.goto();

    // Expect a title "to contain" a substring.
    await expect( page ).toHaveTitle( /Open WebUI/ );

    await webui.login( 'test@e2e.com', 'test' );
    await webui.waitForNewChat( 5000 );
    await webui.news();

    await webui.newChatButton.click();

    const username = page.getByRole( 'button', { name: 'TestE2E' } ).locator( 'div.font-medium' );

    await page.waitForTimeout( 5000 );
    // const username = page.getByPlaceholder('TestE2E');
    await username.click();


    const item = page.locator('a', { hasText: 'Word Power Challenge' });
    await item.click();

    await page.waitForLoadState( 'networkidle' );
    await expect( page.getByText( /hello,\s*teste2e/i ) ).toBeVisible( { timeout: 15000 } );



} );
