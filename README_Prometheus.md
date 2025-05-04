# StreamRoller: The Ultimate Open-Source Streaming Backend Platform

## Project Overview

StreamRoller is a comprehensive, open-source streaming backend system designed to revolutionize the live streaming experience by unifying multiple streaming tools and utilities into a single, powerful platform.

### Core Purpose

The primary goal of StreamRoller is to provide streamers with a centralized, highly configurable system that simplifies and enhances the streaming workflow. By consolidating various streaming-related functionalities into one integrated environment, it eliminates the need to constantly switch between multiple applications.

### Key Problems Solved

- **Complex Streaming Workflow**: Eliminates the complexity of managing multiple tools and applications simultaneously
- **Limited Automation**: Provides an advanced trigger and action system to automate stream-related tasks
- **Fragmented Stream Control**: Offers a unified web interface for comprehensive stream management

### Key Features and Benefits

- **Unified Control Interface**: Centralize management of streaming tools through a single web portal
- **Extensive Extensibility**: Supports a wide range of extensions for customization and expanded functionality
- **Advanced Trigger/Action System**: Create complex, automated workflows with over 5,872,860 possible combinations
- **Seamless Integration**: Connect and control various services like Twitch, Discord, OBS, and more
- **AI-Powered Interactions**: Includes an AI chatbot with natural language processing capabilities
- **Open Source Flexibility**: Community-driven development allowing for continuous improvement and custom extensions

### Technical Highlights

- Socket-based architecture for real-time communication
- Modular extension system
- Web-based control panel
- Supports multiple streaming platforms
- Highly configurable and customizable

**Current Development Stage**: Alpha

## Getting Started, Installation, and Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- A web browser
- Git (optional, for cloning the repository)

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/StreamRoller.git
cd StreamRoller
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. Open your web browser and navigate to:
```
http://localhost:3000
```

### Development Mode

To run the application in development mode with debug logging:
```bash
npm run startdebug
```

### Configuration

Before first use, you may need to configure extension-specific settings:
- Navigate to the admin page
- Configure credentials for each extension you plan to use
- Each extension may require different authorization steps

### Important Notes

- The system is designed to run in a controlled environment (e.g., behind your home router)
- Current implementation does not include advanced security features
- Extension support varies, so check individual extension documentation for specific requirements

### Supported Platforms

- Windows
- macOS
- Linux (with Node.js installed)

### Recommended Development Tools

- [Visual Studio Code](https://code.visualstudio.com/download) (recommended editor)
- Node.js development environment

### Troubleshooting

- Ensure all dependencies are installed correctly
- Check console output for any error messages
- Verify that required credentials are properly configured for each extension

## API Documentation

WebSocket-based Communication System

### Overview
StreamRoller uses a WebSocket-based communication system for real-time messaging between extensions and the server. The system supports broadcasting messages to channels and sending messages directly to specific extensions.

### Connection Details
- **Protocol**: WebSocket
- **Default Host**: `localhost`
- **Default Port**: `3000`
- **API Version**: `0.2`

### Message Types

#### Server Packet Types
- `RequestSoftwareVersion`: Retrieve the current software version
- `RequestConfig`: Request server configuration
- `SaveConfig`: Save configuration data
- `RequestData`: Request extension data
- `SaveData`: Save extension data
- `UpdateCredentials`: Update credentials for an extension
- `RequestCredentials`: Retrieve credentials for an extension
- `DeleteCredentials`: Remove credentials for an extension
- `RequestExtensionsList`: Get list of active extensions
- `RequestAllExtensionsList`: Get complete list of extensions
- `RequestChannelsList`: Retrieve available communication channels
- `CreateChannel`: Create a new communication channel
- `JoinChannel`: Join an existing channel
- `LeaveChannel`: Leave a communication channel
- `ExtensionMessage`: Send a message to a specific extension
- `ChannelData`: Broadcast data to a channel
- `SetLoggingLevel`: Configure server logging level
- `RequestLoggingLevel`: Retrieve current logging level

### Message Packet Structure
```json
{
  "type": "MessageType",
  "from": "ExtensionName",
  "dest_channel": "ChannelName", 
  "to": "TargetExtensionName",
  "ret_channel": "ReturnChannelName",
  "data": {}, 
  "version": "0.2"
}
```

### WebSocket Event Handlers
- `connect`: Triggered on successful connection
- `disconnect`: Triggered when connection is lost
- `message`: Receives incoming messages

### Channel System
- Extensions can create, join, and leave channels
- Channels allow broadcasting messages to multiple extensions
- Default system channel: `datacenter_channel`

### Triggers and Actions
Specific extensions can define triggers and actions to interact with the system. Each trigger/action includes:
- Name
- Display Title
- Description
- Message Type
- Parameters

### Extension Communication Examples

#### Requesting Software Version
```javascript
connection.emit("message", {
  type: "RequestSoftwareVersion",
  from: "YourExtensionName",
  version: "0.2"
});
```

#### Sending Extension Message
```javascript
connection.emit("message", {
  type: "ExtensionMessage",
  from: "SenderExtension",
  to: "TargetExtension",
  data: {
    type: "YourMessageType",
    payload: {...}
  }
});
```

### Limitations
- One socket connection per extension
- Maximum message size: 100MB
- Connection timeout: 120 seconds

### Authentication
Authentication is handled through credentials management via WebSocket messages.

### Error Handling
- Version mismatches
- Invalid message formats
- Missing required fields will trigger error messages

### Additional Resources
- [StreamRoller GitHub Repository](https://github.com/SilenusTA/StreamRoller)

## Authentication

The StreamRoller platform implements a flexible, secure authentication mechanism for various integrations and extensions:

### Credential Storage
Authentication credentials are handled through a secure, encrypted storage system:
- Credentials are encrypted using AES-256-CBC encryption
- A unique encryption key and initialization vector (IV) are generated for each installation
- Encrypted credentials are stored in a dedicated credential store directory

### Authentication Methods
The platform supports multiple authentication approaches depending on the specific extension:

#### OAuth 2.0 Authentication
Many platform integrations (such as Twitch and Kick) use OAuth 2.0 for secure authorization:
- Uses industry-standard OAuth 2.0 authorization flow
- Supports scoped access tokens
- Requires client ID and client secret for each service
- Implements secure state management to prevent CSRF attacks

##### OAuth Flow Example (Twitch)
1. Redirect to Twitch OAuth authorization endpoint
2. Request specific scopes for access
3. Validate and parse access token from callback
4. Store encrypted credentials securely

#### Credential Management
- Credentials are managed through a centralized credential management system
- Supports encryption and decryption of sensitive information
- Allows secure storage and retrieval of authentication tokens
- Provides methods to save, load, and delete credentials for different extensions

### Security Considerations
- Encryption keys are unique to each installation
- Credentials are never stored in plain text
- OAuth tokens are managed with refresh and expiration handling
- Supports multiple authentication providers with a consistent security model

## Deployment

### Deployment Options

#### Executable Release
The project provides a Windows executable deployment method:
- Automatic builds are created using GitHub Actions
- Releases are generated as `.exe` and `.zip` files
- Pre-releases are automatically pushed to the project's GitHub repository

#### Manual Deployment
For manual deployment, the application supports the following methods:

##### Local Development
1. Ensure Node.js (version 20.16.0 or compatible) is installed
2. Clone the repository
3. Run `npm install` to install dependencies
4. Start the application using:
   - Development mode: `npm start`
   - Debug mode: `npm run startdebug`

##### Docker Deployment
Currently, a Docker deployment configuration is not provided in the repository.

#### Environment Considerations
- The application uses environment variables for configuration
- Debug levels can be set via `STREAMROLLER_DEBUG_LEVEL`
- Recommended to use a dedicated environment for production deployment

#### Scaling
- The application is built on a socket-based architecture
- Horizontal scaling methods are not directly specified in the current implementation
- Consider load balancing and clustering techniques for high-traffic scenarios

#### Recommended System Requirements
- Operating System: Windows (primary support)
- Node.js: 20.16.0
- Minimum RAM: 4GB
- Recommended RAM: 8GB or higher

#### Important Notes
- Always back up configuration and data before upgrading
- Verify compatibility with extensions when changing versions

## Project Structure

The project is organized into several key directories that support its modular and extensible architecture:

### Root Directory
- `backend/`: Core backend services and data management
- `docs/`: Documentation and resources
- `extensions/`: Modular extensions for different functionalities
- `overlays/`: Web-based visual overlays
- Configuration files like `package.json`, `nodemon.json`

### Backend Structure
The `backend/data_center/` directory contains core server components:
- `modules/`: Shared utility and core modules
  - `common.js`: Likely contains shared utility functions
  - `logger.js`: Logging functionality
  - `message_handlers.js`: Handles message processing
  - `server_socket.js`: Socket communication logic
- `configstore/`: Configuration storage
- `credentialstore/`: Secure credential management
- `datastore/`: Data persistence
- `server.js`: Main server entry point
- `execphp.js`: PHP execution utility

### Extensions Directory
Each extension is a self-contained module with a consistent structure:
- `README.md` or `README.part`: Extension documentation
- Main extension file (e.g., `twitch.js`, `chatbot.js`)
- `package.json`: Dependency management
- `public/` or `server/`: Extension-specific resources
- `views/`: Template and frontend files
- Settings widgets for configuration

### Notable Extension Examples
- Twitch integration
- Discord chat
- OBS control
- Chatbot
- Streaming utilities (MultiStream, StreamerSongList)
- Automation (Autopilot)

### Overlays
Web-based visual components for streaming:
- `ScrollingBanner_1/`
- `StaticText_1/`
- `image_1/`

### Documentation
- `docs/apidocs/`: Detailed API documentation
- `docs/developement/`: Development guidelines and standards
- `docs/user/`: User-focused documentation

### Additional Resources
- `.github/workflows/`: CI/CD pipeline configurations
- `extensions/~~*/`: Commented out or experimental extensions

## Technologies Used

### Core Backend Technologies
- **Node.js**: Primary runtime environment
- **Express.js**: Web application framework
- **Socket.IO**: Real-time, bidirectional communication
- **EJS**: Templating engine for dynamic HTML generation

### Frontend and Rendering
- **HTML5**
- **CSS3**
- **Client-side JavaScript**

### Development and Build Tools
- **Nodemon**: Utility for automatic server restarts during development
- **JSDoc**: Documentation generation tool
- **Caxa**: Potentially used for packaging/deployment

### AI and Integration
- **OpenAI API**: AI-powered features
- **node-fetch**: HTTP request library

### Extension Ecosystem
Multiple extensions support various platforms and services, including:
- Twitch
- YouTube
- Discord
- OBS
- MSFS 2020
- Philips Hue
- And more...

### Additional Libraries
- **Debug**: Logging and debugging utility
- **Request**: Simplified HTTP client

### Runtime Environment
- **Node.js Version**: 20.16.0+

## Additional Notes

### Project Architecture and Philosophy

StreamRoller is designed with flexibility and extensibility as core principles. The system uses a WebSocket-based architecture that allows for modular, easy-to-integrate extensions across various streaming-related functionalities.

### Scalability and Distributed Potential

One of the unique aspects of StreamRoller is its potential for distributed computing. The WebSocket-based design enables:
- Running different components on separate machines
- Distributing extensions across multiple systems
- Potential for remote moderation and control

### Extensibility Considerations

While currently focused on Twitch streaming, the architecture supports future expansion to:
- Multiple streaming platforms
- Advanced integrations like home automation
- Custom extension development

### Development Roadmap Insights

Planned future developments include:
- Cross-platform chat moderation
- NDI stream integration
- Auto-clip generation
- Text-to-speech functionality
- Multi-platform support

### Security and Usage Context

**Important Security Note**: 
- Designed for controlled, home network environments
- Credentials are locally encrypted
- Recommended to use behind a router firewall
- Not intended for public-facing deployment in its current alpha stage

### Contribution and Community

StreamRoller is an open-source project that thrives on community involvement. Developers with web programming skills (particularly JavaScript and WebSocket experience) are encouraged to contribute extensions and improvements.

### Technical Requirements

- Requires Node.js for backend functionality
- Primarily JavaScript-based
- WebSocket communication protocol
- Recommended development environment: Visual Studio Code

### Experimental Features

Some extensions are experimental and under active development. Users should expect:
- Frequent updates
- Potential breaking changes
- Opportunities for early adopter feedback

### Performance and Scalability

The trigger and action system offers an impressive:
- 5,872,860 possible trigger-action combinations
- 5,297 user-configurable triggers
- Theoretically infinite chained command potential

## Contributing

We welcome contributions from the community! To ensure a smooth contribution process, please follow these guidelines:

### Code Standards

- Follow the coding standards outlined in our [Coding Standards documentation](docs/developement/CodingStandards.md)
- Maintain consistent code style with existing project code
- Add clear and descriptive comments to your code

### Getting Started

1. Fork the repository
2. Clone your forked repository
3. Create a new branch for your feature or bugfix
   - Use a clear and descriptive branch name
   - Example: `feature/add-new-extension` or `bugfix/resolve-connection-issue`

### Development Setup

- Refer to the [Extensions Getting Started guide](docs/developement/EXTENSIONS_GETTING_STARTED.md) for detailed setup instructions
- Ensure you have the required dependencies installed
- Test your changes thoroughly before submitting a pull request

### Contribution Process

1. Make your changes in a clear, focused manner
2. Write or update tests as appropriate
3. Ensure all existing and new tests pass
4. Update documentation if your changes impact existing functionality
5. Commit with clear, descriptive commit messages

### Submitting a Pull Request

- Open a pull request against the main repository
- Provide a clear description of the changes
- Include the purpose and context of your contribution
- Be prepared to discuss and refine your implementation

### Communication

- For questions or suggestions, join our [Discord community](https://discord.gg/EyJy8brZ6R)
- Discuss major changes or features before implementation
- Be respectful and collaborative

### Additional Resources

- [Coding Standards](docs/developement/CodingStandards.md)
- [Extensions Getting Started](docs/developement/EXTENSIONS_GETTING_STARTED.md)

Thank you for contributing to StreamRoller!

## License

This project is licensed under the GNU Affero General Public License (AGPL) version 3. 

The AGPL is a copyleft license specifically designed for network server software, ensuring that the source code remains open and accessible even when the software is run as a networked service.

Key points of the license include:
- You can freely use, modify, and distribute the software
- Any modifications or derivative works must also be released under the same license
- If you run this software as a networked service, you must make the complete source code available to users of that service

A full copy of the license is available in the [LICENSE.md](LICENSE.md) file in the repository.

For more details, visit the [GNU Affero General Public License website](https://www.gnu.org/licenses/agpl-3.0.en.html).