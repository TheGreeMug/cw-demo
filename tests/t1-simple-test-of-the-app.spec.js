import { it } from 'node:test';
import { test, expect } from '../spec/page';
import { time } from 'node:console';

test( '@local test1 - teach the webui page', async ( { page, webui } ) => {
    await webui.goto();

    // Expect a title "to contain" a substring.
    await expect( page ).toHaveTitle( /Open WebUI/ );
    await webui.login( 'mn@mn.mn', 'mn' );
    await page.waitForTimeout( 5000 );

    /* const block */
    const promptField = page.getByPlaceholder( 'How can I help you today?' );
    const sendButton = page.locator('#send-message-button');
    const editor = page.locator( '#chat-input' );
    const messages = page.locator( '#messages-container' );
    const reply = messages.locator( '.chat-assistant' ).first();
    const txtarea = page.locator ('#chat-input');
    const followup = 'Give me a follow up' 
    const openSidebar = page.locator( 'button[aria-label="Open Sidebar"]' );
    /* end const block */

    // first message
    await editor.click();
    await page.keyboard.type( 'abracadabra' );
    await page.keyboard.press( 'Enter' );

    // assertions for first message
    await expect( messages.locator( '.user-message' ) ).toContainText( 'abracadabra', { timeout: 15000 } );
    await expect( reply ).toBeVisible( { timeout: 15000 } );
    await expect( reply ).toContainText( /.+/, { timeout: 15000 } );

    // follow up message
    await txtarea.click();
    await page.keyboard.type( followup );
    await expect( sendButton ).toBeVisible( { timeout: 15000 } );
    await page.locator('#send-message-button').click();
    await page.keyboard.press( 'Enter' );

    // assertions for follow up message
    await expect( messages.locator( '.user-message' ).nth( 1 ) ).toContainText( followup, { timeout: 15000 } );
    await expect( messages.locator( '.chat-assistant' ).nth( 1 ) ).toBeVisible( { timeout: 15000 } );

    /* delete the chat */
    await openSidebar.click();
    const chats = page.locator( '#sidebar-chat-item' );
    const before = await chats.count();
    await page.locator( 'button[aria-label="Chat Menu"]' ).first().click();
    await page.getByRole( 'menuitem', { name: 'Delete' } ).click();
    await expect( page.getByText( 'Delete chat?' ) ).toBeVisible( { timeout: 5000 } );
    await page.getByRole( 'button', { name: 'Confirm' } ).click();
    await expect( chats ).toHaveCount( before - 1 );
    /* end delete the chat */

});
