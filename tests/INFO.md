# Test Info (t1/2/3/4/9)

- t1 (`tests/t1-simple-test-of-the-app.spec.js`): Login, send a message, verify reply, send follow-up, verify reply, delete chat.
- t2 (`tests/t2-test-simpel-instr.spec.js`): Login, send instruction message expecting "OK", ask code word, verify "OK", delete chat.
- t3 (`tests/t3-test-complex-instr.spec.js`): Login, request alphabet output and 30 animals, verify comma count, delete chat.
- t4 (`tests/t4-api-chats.spec.js`): Login, send "abracadabra", assert API payloads include the user prompt and a non-empty assistant reply.
- t9 (`tests/t9-delete-chats.spec.js`): Login, delete all existing chats from the sidebar.
