# wh-wrapper

**Please Note**: This library is currently under active development and the code is unfinished/unstructured. Breaking changes should be expected in upcoming days as the library evolves.

wh-wrapper is a library that is being developed to wrap and simplify access to the WhatsApp Cloud API from JavaScript/TypeScript applications.

# installation

```bash
npm i wh-wrapper
```

# Setup and Usage

```js
import Client from "wh-wrapper";

const wh = new Client(phoneNumberId, TOKEN, verifyToken);

wh.on("messages", async (message) => {
  console.log(message);
  await message.markMessageAsRead();
  await message.replyText("Welcome from wh-wrapper");
});

wh.on("statuses", async (status) => {
  console.log(status);
});
```

# Current Status:

The code for this library was originally some unpublished wrapper code I had written for my own use. I have now open-sourced it to build out into a full-fledged library for public use.

Over the next few days, I will be restructuring the code and organizing it properly as the library takes shape. Please excuse any messiness or lack of coherence for now!

# Contributing

If you'd like to contribute to wh-wrapper as the code takes form, pull requests are welcome! Just be aware the structure and APIs may change rapidly in the short term.

# Support

If you have any questions, feel free to open a GitHub issue!
