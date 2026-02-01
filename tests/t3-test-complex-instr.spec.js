import { test, expect } from '../spec/page';

test( '@local test1 - teach the webui page', async ( { page, webui } ) => {
    await webui.goto();

    const txtarea = page.locator( '#chat-input' );
    const sendButton = page.locator( '#send-message-button' );
    const followup = 'What is my code word?';

    // expect a title "to contain" a substring.
    await expect( page ).toHaveTitle( /Open WebUI/ );
    await webui.login( 'mn@mn.mn', 'mn' );
    await page.waitForTimeout( 5000 );

    await webui.sendMessageAndExpectReply( 'ONLY write the english alphabet in lowercase letters unseparated.',
        'a b c d e f g h i j k l m n o p q r s t u v w x y z' ),
        { replyIndex: 0, timeout: 15000 };

    await webui.sendMessageAndExpectReply(
        'ONLY list 30 animals separated by commas.',
        ',',
        { userMessageIndex:1, replyIndex: 1, timeout: 15000 }
    );

    const messages = page.locator( '#messages-container' );
    const reply = messages.locator( '.chat-assistant' ).nth( 1 );

    await webui.waitForStableMessageText( reply, { stableForMs: 3000, intervalMs: 1000, timeout: 15000 } );

    const text = await reply.innerText();
    const commaCount = ( text.match( /,/g ) || [] ).length;
    expect( commaCount ).toBe( 29 );

    //delete the last added chat
    await webui.deleteFirstChat();

} );
