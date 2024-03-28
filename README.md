# wh-wrapper

 [![npm](https://img.shields.io/npm/v/wh-wrapper)](https://www.npmjs.com/package/wh-wrapper) [![Downloads](https://img.shields.io/npm/dw/wh-wrapper)]((https://www.npmjs.com/package/wh-wrapper)) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Issues](https://img.shields.io/github/issues/ElhananFine/wh-wrapper)](https://github.com/ElhananFine/wh-wrapper/issues)


wh-wrapper is a robust and developer-friendly wrapper library for the WhatsApp Cloud API, meticulously crafted to streamline the process of building powerful and feature-rich WhatsApp bots. 🤖 With this library, you can seamlessly integrate WhatsApp messaging capabilities into your applications, unlocking a world of possibilities for engaging with your users. 💬

## Features 🚀

**Lightning-fast**: ⚡ Leveraging modern JavaScript and optimized performance, wh-wrapper ensures blazing-fast message delivery and processing.

**Seamless Messaging**: 📨 Send and receive messages with ease, supporting rich media attachments, interactive buttons, and more.

**Webhook Support**: 🎣 Receive real-time updates and incoming messages through webhooks, enabling instant responsiveness.

**TypeScript Friendly**: 🦾 Enjoy the benefits of type safety and better tooling with comprehensive TypeScript support.

**Template Management**: 🗃️ Create and manage reusable message templates for consistent and streamlined communication.

**Comprehensive Documentation**: 📚 Get up and running quickly with detailed guides, examples, and extensive API documentation.

## Installation 📦

You can install wh-wrapper using npm or your preferred package manager:

```bash
npm install wh-wrapper
```

## Quick Start ⏩

Initialize a new WhatsApp client instance and start sending and receiving messages:

```javascript
import Client from 'wh-wrapper';
// or if using require:
// const Client = require('wh-wrapper');

const wh = new Client(phoneID, token);

wh.on('messages', async (message) => {
  console.log(message); // Handle incoming messages here
});

const messageId = await wh.sendMessage(recipientPhoneNumber, 'Hello, World!');
```

### Webhook Example 🕸️

```javascript
import Client from 'wh-wrapper';
// or if using require:
// const Client = require('wh-wrapper');

const verifyToken = 'your_verify_token';

const wh = new Client(phoneID, token, verifyToken);

wh.on('messages', async (message) => {
  console.log(message); // Handle incoming messages here
});
wh.on("statuses", async (status) => {
  console.log(status); // Handle incoming statuses here
});
```

For more detailed instructions and advanced usage, please refer to the [documentation](https://docs.elhananfine.com/docs). 📖

## Requirements ✅

- Node.js >= 12.x
- WhatsApp Cloud API account and credentials. If you don't have credentials or aren't sure what this is, [please refer to our getting started guide with Facebook and WhatsApp](https://docs.elhananfine.com/docs/Guides/getting-started)

## To-Do 📋

- Add support for Flows ⚙️
- Enhance incoming message types (TypeScript) 🏷️
- Expand documentation and examples 📖

## License 📄

wh-wrapper is licensed under the [MIT License](https://github.com/ElhananFine/wh-wrapper/blob/main/LICENSE).

## Contributing 🤝

Contributions are welcome! 🙌 If you find any issues or have ideas for improvements, please open an issue or submit a pull request. For major changes, it's recommended to discuss them first by creating an issue.

## Active Development 🚧

Please note that wh-wrapper is under active development, and breaking changes may be introduced as new features and improvements are implemented. However, the library is already usable and comes with comprehensive documentation (which is also a work in progress). 🔨

--- Made with ❤️ and 🔨 by Elhanan