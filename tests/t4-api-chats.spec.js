import { test, expect } from '../spec/page';

test( '@local test1 - api payloads include "racadabra"', async ( { page, webui } ) => {

    await webui.goto();
    await expect( page ).toHaveTitle( /Open WebUI/ );
    await webui.login( 'mn@mn.mn', 'mn' );
    await page.waitForTimeout( 3000 );

    // type "abracadabra" into the chat input
    const input = page.locator( '#chat-input' );
    await input.click();
    await page.keyboard.type( 'abracadabra' );

    /* set up API response listeners to capture the payloads*/
    // this returns the new chat creation response
    const newChatResponse = page.waitForResponse(
      ( res ) =>
        res.url().includes( '/api/v1/chats/new' ) && 
        res.request().method() === 'POST'
    );

    // this returns the assistant output response for the prompt
    const completedResponse = page.waitForResponse(
      ( res ) =>
        res.url().includes( '/api/chat/completed' ) && 
        res.request().method() === 'POST'
    );
    /* end API response listeners */

    // send the message (Enter triggers the submit)
    await page.keyboard.press( 'Enter' );

    // parse the JSON bodies from both API responses
    const newChatJson = await ( await newChatResponse ).json();
    const completedJson = await ( await completedResponse ).json();

    // /api/v1/chats/new stores messages under chat.messages
    // We look for the user message that includes "abracadabra"
    const newChat = newChatJson?.chat;
    const newChatMessages = newChat?.messages ?? [];
    let hasUserAbracadabra = false;

    // iterate through the messages to find the user prompt
    for ( const message of newChatMessages ) {
      // skip anything that isn't a user message
      if ( message?.role !== 'user' ) {
        continue;
      }

      // normalize to lowercase so the match is case-insensitive.
      const content = message?.content ?? '';
      const normalized = content.toLowerCase();
      if ( normalized.includes( 'abracadabra' ) ) {
        hasUserAbracadabra = true;
        break;
      }
    }

    // assert the user prompt was recorded in the "new chat" payload
    expect( hasUserAbracadabra ).toBeTruthy();

    // /api/chat/completed returns a flat messages array
    // we verify the user message is echoed here as well
    const completedMessages = completedJson?.messages ?? [];
    // initialize a flag to track if we found the user message
    let hasUserMessageInCompletedResponse = false;

    for ( const message of completedMessages ) {
      // Again, only look at user messages.
      if ( message?.role !== 'user' ) {
        continue;
      }

      // look for the prompt text inside the user message
      const content = message?.content ?? '';
      const normalized = content.toLowerCase();
      if ( normalized.includes( 'abracadabra' ) ) {
        hasUserMessageInCompletedResponse = true;
        break;
      }
    }

    // assert the completed payload contains the user prompt
    expect( hasUserMessageInCompletedResponse ).toBeTruthy();

    // find the assistant reply and ensure it isn't empty
    let assistantContent = '';
    // iterate through messages to find the assistant response
    for ( const message of completedMessages ) {
      if ( message?.role === 'assistant' ) {
        // extract the content
        assistantContent = message?.content ?? '';
        break;
      }
    }

    // assert that we got a non-empty assistant response
    expect( assistantContent.length > 0 ).toBeTruthy();
    
});
