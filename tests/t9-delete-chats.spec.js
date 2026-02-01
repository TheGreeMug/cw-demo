import { test, expect } from '../spec/page';

test( '@local test1 - delete all existing chats', async ( { page, webui } ) => {
    await webui.goto();

    // Expect a title "to contain" a substring.
    await expect( page ).toHaveTitle( /Open WebUI/ );
    await webui.login( 'mn@mn.mn', 'mn' );
    await page.waitForTimeout( 1000 );

    // simplest check that we are logged in is the presence of the prompt field
    const promptField = page.getByPlaceholder( 'How can I help you today?' );

    const openSidebar = page.locator( 'button[aria-label="Open Sidebar"]' );
    await openSidebar.click();
    await expect( page.locator( '#sidebar-chat-item' ).first() ).toBeVisible();
    await page.waitForTimeout( 2000 );

    const chats = page.locator( '#sidebar-chat-item' );

    for ( let count = await chats.count(); count > 0; count = await chats.count() ) {
        await page.locator( '#sidebar-chat-item' ).first().hover();
        await page.locator( 'button[aria-label="Chat Menu"]' ).first().click();
        // choose Delete
        await page.getByRole( 'menuitem', { name: 'Delete' } ).click();
        // confirm modal
        await expect( page.getByText( 'Delete chat?' ) ).toBeVisible( { timeout: 5000 } );
        await page.getByRole( 'button', { name: 'Confirm' } ).click();
        // wait for this item to disappear before next loop
        await expect( chats ).toHaveCount( count - 1 );
    }
} );
