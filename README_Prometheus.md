# StreamRoller: A Comprehensive Open-Source Streaming Backend System for Content Creators

## Project Overview

StreamRoller is a comprehensive, open-source streaming backend system designed to revolutionize the live streaming experience by providing an all-in-one solution for content creators. At its core, the platform offers a unified, extensible interface that consolidates multiple streaming tools and functionalities into a single, powerful web application.

### Core Purpose

The primary goal of StreamRoller is to solve the complexity and fragmentation inherent in modern streaming setups. By integrating various tools and services into a centralized platform, it eliminates the need to switch between multiple applications during a live stream, thereby simplifying the streaming workflow.

### Key Features and Benefits

- **Unified Control Interface**: Manage all streaming tools from a single web portal, reducing application switching and increasing streaming efficiency.

- **Extensive Automation Capabilities**: Create complex trigger-action workflows with over 5,872,860 possible combinations, enabling unprecedented stream customization.
  - Automate responses to events like donations, chat messages, and subscriber actions
  - Chain multiple actions across different platforms (e.g., post a tweet when receiving a donation)

- **Modular Extension Architecture**: 
  - Currently supports 5,297 configurable triggers and actions
  - Easily extendable through a plugin system
  - Open-source design encouraging community contributions

- **Multi-Platform Integration**:
  - Twitch chat and event handling
  - Discord notifications
  - Twitter posting
  - OBS scene control
  - AI-powered chatbot
  - Streamlabs API support

- **Customizable AI Chatbot**: 
  - Powered by OpenAI's ChatGPT
  - Configurable personality to match channel ethos
  - Automatic chat monitoring and interaction

### Current Development Stage

StreamRoller is currently in its Alpha stage, actively seeking community feedback and contributions to refine and expand its capabilities.

## Getting Started, Installation, and Setup

### Quick Start Guide

StreamRoller is a versatile streaming backend system that integrates various streaming tools into a single, unified interface. Follow these steps to get started:

#### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.16.0 or later)
- Web browser

#### Installation Steps
1. Download the StreamRoller repository from the [releases page](https://github.com/SilenusTA/StreamRoller/releases)
2. Extract the zip file to your desired location
3. Open a terminal/command prompt in the project's root directory
4. Install dependencies:
   ```bash
   npm install
   ```

#### Running the Application
1. Start the StreamRoller server:
   ```bash
   npm start
   ```
2. Open your web browser and navigate to `http://localhost:3000`

### Setup and Configuration

#### Initial Configuration
1. Click on the "Admin" link in the web interface
2. Configure credentials for the extensions you want to use
   - For Twitch chat: Twitch tokens
   - For AI Chatbot: OpenAI token
   - For Discord integration: Discord credentials
   - For other extensions: Follow specific extension requirements

### Development Mode
For developers or debugging, use the debug start command:
```bash
npm run startdebug
```

### System Requirements
- Operating System: Windows, macOS, or Linux
- Minimum RAM: 4GB
- Recommended: Modern multi-core processor

### Important Notes
- The system is currently in Alpha stage
- Designed to run in a controlled home network environment
- Security tokens are encrypted and stored locally

### Supported Extensions
- Twitch Chat
- Discord Chat
- OBS Control
- AI Chatbot
- Streamlabs API
- Twitter Integration
- And many more...

### Next Steps
1. Explore the Live Portal webpage
2. Configure desired extensions
3. Set up triggers and actions
4. Customize your streaming workflow

### Troubleshooting
- Ensure all dependencies are correctly installed
- Check console output for any error messages
- Verify extension-specific configurations
- Join the [StreamRoller Discord](https://discord.gg/EyJy8brZ6R) for community support

## API Documentation

StreamRoller uses a WebSocket-based messaging system for communication between extensions and the core server. This section describes the messaging protocol and available message types.

### Connection and Authentication

- **Connection Protocol**: WebSocket
- **Default Port**: 3000
- **Connection Method**: Clients connect to `ws://localhost:3000`
- **Initial Connection**: Upon connection, the server sends a unique client ID

### Message Packet Structure

Each message packet contains the following key fields:
```json
{
  "version": "API version",
  "type": "Message type",
  "from": "Sender extension name",
  "to": "Optional: Target extension",
  "data": "Message payload"
}
```

### Core Message Types

#### System Messages
- `RequestSoftwareVersion`: Retrieve current StreamRoller software version
- `RequestConfig`: Fetch current server configuration
- `SaveConfig`: Save configuration changes
- `RequestData`: Retrieve extension data
- `SaveData`: Save extension data
- `RequestExtensionsList`: Get list of active extensions
- `RequestChannelsList`: Retrieve available communication channels

#### Control Messages
- `CreateChannel`: Create a new communication channel
- `JoinChannel`: Join an existing channel
- `LeaveChannel`: Leave a channel
- `ExtensionMessage`: Send messages between extensions
- `ChannelData`: Broadcast data across a channel
- `SetLoggingLevel`: Adjust server logging verbosity
- `StopServer`: Shutdown the StreamRoller server
- `RestartServer`: Restart the server

### Authentication and Credentials

- Credentials are managed through extension-specific messages:
  - `UpdateCredentials`: Update extension credentials
  - `RequestCredentials`: Retrieve extension credentials
  - `DeleteCredentials`: Remove extension credentials

### Example WebSocket Connection (JavaScript)

```javascript
const socket = io('http://localhost:3000', { 
  transports: ['websocket'] 
});

socket.on('connect', () => {
  const clientId = socket.id;
  
  // Request software version
  socket.emit('message', {
    version: '1.0',
    type: 'RequestSoftwareVersion',
    from: 'YourExtensionName'
  });
});
```

### Notes
- API version must match the server's version
- Extensions communicate via message-passing
- Credentials and configurations are extension-specific
- Automatic extension discovery and management

### OpenAPI/Swagger Specification
No traditional REST API specification is available. Refer to the WebSocket messaging protocol for integration details.

## Authentication

### Authentication Mechanism

StreamRoller uses a secure, flexible authentication approach designed to support multiple platforms and services:

#### OAuth 2.0 Authentication
Most integrations leverage OAuth 2.0 for secure, token-based authentication. The authentication process typically involves:

- Platform-specific OAuth endpoints
- Client ID and client secret configuration
- Secure token exchange and storage
- Scoped access permissions

#### Key Security Features
- Credentials are encrypted using AES-256-CBC encryption
- Initialization vectors (IV) are randomly generated
- Credentials are stored in a dedicated credential store
- Encrypted credential files are platform and extension-specific

#### Authentication Flow
1. User initiates authorization for a specific service
2. Redirected to the platform's OAuth authorization page
3. User grants requested permissions
4. Platform redirects back with an access token
5. Token is securely stored and encrypted
6. Token used for subsequent API interactions

#### Supported Platforms
Currently supports OAuth authentication for:
- Twitch
- Kick
- Other extensible platforms

#### Credential Management
- Credentials are managed through a centralized credential management system
- Supports dynamically loading, saving, and deleting credentials
- Provides robust encryption for credential storage

**Note:** Always keep your credentials confidential and never share them publicly.

## Deployment

### Deployment Options

#### Local Development Deployment
The project supports local deployment using Node.js. Here are the primary deployment methods:

##### Development Server
Start the development server using npm scripts:
```bash
npm start                  # Starts server with Nodemon
npm run startdebug         # Starts server with extended debug logging
```

#### Continuous Integration and Deployment (CI/CD)
The project uses GitHub Actions for automated builds and releases:

- Triggered on tags matching the pattern `ci*.*.*`
- Automatically increments version and creates release tags
- Builds and publishes development and production releases
- Includes automated documentation updates

##### Deployment Workflow
1. Create a tag following the `ci*.*.*` pattern
2. GitHub Actions will:
   - Install dependencies
   - Increment version
   - Create a new release tag
   - Build the project
   - Update documentation

#### Installation Prerequisites
- Node.js (version 20.16.0 or compatible)
- npm (Node Package Manager)

#### Post-Installation Setup
```bash
npm install                # Install root dependencies
cd backend && npm install  # Install backend dependencies
```

### Scaling and Environment Considerations
- Uses Nodemon for automatic server restart during development
- Supports debug mode with configurable debug levels
- Environment variable `STREAMROLLER_DEBUG_LEVEL` can be used for logging configuration

### Deployment Platforms
While no specific platform-specific configurations are provided, the project is compatible with:
- Local development environments
- Containerized deployments (Docker-ready)
- Cloud platforms supporting Node.js applications (e.g., Heroku, AWS, Azure)

### Notes
- Always ensure you have the latest dependencies before deployment
- Review the project's configuration files for specific environment settings

## Project Structure

The project is organized into several key directories to support its modular and extensible architecture:

### Main Project Structure
- `backend/`: Core backend services and data management
  - `data_center/`: Central data handling and server configuration
    - `configstore/`: Configuration storage
    - `credentialstore/`: Secure credential management
    - `datastore/`: Data persistence and storage
    - `modules/`: Reusable backend modules and utilities
    - `server.js`: Main backend server entry point

- `extensions/`: Modular extensions for various functionalities
  - Individual extension directories (e.g., `twitch/`, `obs/`, `chatbot/`)
    - Each extension contains:
      - Main extension script
      - Settings widgets
      - Server-side logic
      - Views and public assets

- `docs/`: Documentation and development resources
  - `apidocs/`: Automatically generated API documentation
  - `developement/`: Development guidelines and specifications
  - `images/`: Documentation-related images
  - `user/`: User documentation

- `overlays/`: Custom overlay templates for streaming
  - Different overlay types (e.g., `ScrollingBanner_1`, `StaticText_1`)
  - Each overlay includes HTML, CSS, and related assets

### Configuration and Utility Files
- Root-level configuration files:
  - `package.json`: Project dependencies and scripts
  - `nodemon.json`: Development server configuration
  - `install.cmd` and `run.cmd`: Windows installation and launch scripts

### Extension Management
- Active extensions are in the main `extensions/` directory
- Commented-out or inactive extensions use `~~` prefix
- Each extension is self-contained with its own package.json and assets

This modular structure allows for easy extension, maintenance, and scalability of the streaming tool ecosystem.

## Technologies Used

### Programming Languages
- JavaScript (Node.js)
- ECMAScript Modules (ESM)

### Backend Frameworks and Libraries
- Express.js: Web application framework
- Socket.IO: Real-time bidirectional event-based communication
- EJS: Templating engine for rendering dynamic HTML
- Nodemon: Development utility for automatic server restarts

### Frontend Technologies
- HTML
- CSS

### Streaming and API Integrations
- Twitch API (@twurple/api, @twurple/auth, @twurple/eventsub-ws)
- OpenAI API
- Node Fetch: HTTP client for making API requests

### Development and Build Tools
- Caxa: Package and distribute Node.js applications
- Debug: Debugging utility

### Package Management
- npm (Node Package Manager)

### Core Dependencies
- Node.js (v20.16.0)

### Extension Architecture
- Modular extension system with socket-based data sharing
- Support for multiple streaming platform integrations

### Additional Tools
- Git: Version control
- GitHub: Repository hosting

## Additional Notes

### Project Philosophy and Future Vision

StreamRoller is more than just a streaming tool—it's a comprehensive ecosystem designed to simplify and enhance the live streaming experience. The project aims to consolidate various streaming functionalities into a single, extensible platform that empowers content creators with unprecedented control and flexibility.

### Extensibility and Customization

The core strength of StreamRoller lies in its modular architecture. Each extension operates as an independent module that can:
- Produce data (like chat messages or alerts)
- Consume and process data
- Trigger complex interactions between different streaming tools

### Potential Use Cases

StreamRoller supports advanced streaming scenarios, such as:
- Automated clip creation and social media posting
- Dynamic scene and lighting changes based on chat interactions
- Cross-platform chat and alert management
- Comprehensive streaming workflow automation

### Roadmap and Community Involvement

Key areas of future development include:
- Multi-platform support (expanding beyond Twitch)
- Advanced moderation tools
- More integrations with streaming and home automation technologies

The project is open-source and welcomes community contributions. Whether you're a developer, streamer, or tech enthusiast, there are numerous ways to get involved and help shape the future of streaming technology.

### Performance and Resource Management

StreamRoller is designed with flexibility in mind:
- Can run entirely on a single machine
- Supports distributed deployment across multiple devices
- Websocket-based architecture enables lightweight, real-time communication

### Limitations and Considerations

- Currently in alpha stage
- Recommended for use in controlled, home network environments
- Requires basic technical knowledge for advanced configurations

### Getting Support and Feedback

- [Discord Community](https://discord.gg/EyJy8brZ6R)
- [Project Website](https://streamroller.stream/)
- GitHub Issues for bug reports and feature requests

## Contributing

We welcome contributions to StreamRoller! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the Repository**
   - Create a fork of the StreamRoller repository on GitHub
   - Clone your forked repository to your local machine

2. **Set Up Development Environment**
   - Install [Node.js](https://nodejs.org/)
   - Recommended editor: [VSCode](https://code.visualstudio.com/)
   - Install project dependencies by running `npm install` in the project root directory

3. **Code Standards**
   - Follow the existing code style in the project
   - Use clear, descriptive variable and function names
   - Write comments to explain complex logic
   - Ensure code is well-formatted and readable

4. **Creating Extensions**
   - New extensions should follow the [Extensions Getting Started](docs/developement/EXTENSIONS_GETTING_STARTED.md) guide
   - Extensions must adhere to the [Coding Standards](docs/developement/CodingStandards.md)
   - Include comprehensive documentation for new extensions

5. **Testing**
   - Verify that your changes do not break existing functionality
   - Add tests for new features or bug fixes if applicable
   - Ensure all existing tests pass before submitting a pull request

6. **Submitting a Pull Request**
   - Create a new branch for your changes
   - Commit with clear, descriptive commit messages
   - Push your branch to your fork
   - Open a pull request against the main StreamRoller repository
   - Provide a detailed description of your changes

### Communication

- Join the [StreamRoller Discord](https://discord.gg/EyJy8brZ6R) for discussions
- Reach out to the maintainer at [twitch.tv/OldDepressedGamer](https://twitch.tv/OldDepressedGamer)

### Important Notes

- The project is currently designed for a controlled home environment
- Security features may be added in future versions
- Contributions that enhance usability and extensibility are particularly welcome

### Version Control for Configurations

When making changes that might affect configurations:
- For minor changes adding optional fields, increment the minor version (e.g., 1.x)
- For breaking changes requiring complete reconfiguration, increment the major version (e.g., x.1)
- Aim to minimize disruption to existing user configurations

### Code of Conduct

Be respectful, inclusive, and constructive in all interactions. We aim to maintain a welcoming environment for all contributors.

## License

This project is licensed under the GNU Affero General Public License (AGPL) version 3. 

### Key Licensing Terms

- The source code is freely available and can be redistributed
- Modified versions must be released under the same license
- If you run this software on a network server, you must make the source code available to users of that server
- There is NO WARRANTY provided with this software

For the complete license terms, please see the [LICENSE.md](LICENSE.md) file in the repository.

### Compliance Requirements

- When using or modifying this software, you must:
  - Preserve all copyright notices
  - Provide the complete source code when distributing
  - Clearly indicate any changes you've made
  - Disclose the source code to network users if running a modified version on a server

For the most up-to-date and detailed licensing information, refer to the full [LICENSE.md](LICENSE.md) or visit the [GNU AGPL v3 website](https://www.gnu.org/licenses/agpl-3.0.en.html).