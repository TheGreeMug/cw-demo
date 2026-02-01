import { test, expect } from '../spec/page';

test( '@local test1 - teach the webui page', async ( { page, webui } ) => {
    await webui.goto();

    const txtarea = page.locator( '#chat-input' );
    const sendButton = page.locator( '#send-message-button' );
    const followup = 'What is my code word?';

    // login
    await expect( page ).toHaveTitle( /Open WebUI/ );
    await webui.login( 'mn@mn.mn', 'mn' );
    await page.waitForTimeout( 2000 );

    // first message + expect to contain
    await webui.sendMessageAndExpectReply(
        'My code word is abracadabra. Reply ONLY with OK.',
        'OK'
    );

    // follow up message 
    await txtarea.click();
    await page.keyboard.type( followup );
    await expect( sendButton ).toBeVisible( { timeout: 15000 } );
    await page.locator( '#send-message-button' ).click();
    await page.keyboard.press( 'Enter' );
    await page.waitForTimeout( 5000 );

    // assertions for follow up message - to contain "OK"
    await expect( page.locator( '#messages-container .user-message' ).nth( 1 ) ).toContainText( followup, { timeout: 15000 } );
    await expect( page.locator( '#messages-container .chat-assistant' ).nth( 1 ) ).toContainText( 'OK' );

    await webui.deleteFirstChat();

} );
