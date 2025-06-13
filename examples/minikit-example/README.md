# MiniKit Example

A demonstration mini app built with Next.js that showcases the various actions and capabilities available in MiniKit.

## Purpose

This project serves as a comprehensive example for developers who want to:

- Learn how to integrate MiniKit functionality into their applications
- Understand the different actions available in the MiniKit SDK
- See practical implementations of common mini app features
- Test MiniKit functionality both inside and outside the Warpcast environment

## Features

### Core MiniKit Actions

- **🔍 Environment Detection** - Displays whether the app is running inside a mini app context
- **➕ Add Frame** - Add frames to the Warpcast client
- **✍️ Compose Cast** - Create new casts directly from the mini app
- **👀 View Cast** - Navigate to and view existing casts
- **❌ Close Frame** - Properly close the mini app when needed

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/coinbase/onchainkit.git
   ```

2. Install dependencies from the root:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm f:minikit-example dev:watch
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Components

Each MiniKit action is implemented as a separate, reusable component:

- **`IsInMiniApp`**: Detects and displays the current environment status
- **`AddFrame`**: Handles adding frames to the Warpcast client
- **`ComposeCast`**: Manages cast composition with pre-filled text
- **`ViewCast`**: Navigates to specific casts using their hash
- **`CloseFrame`**: Provides a way to close the mini app

## Learn More

- [MiniKit Documentation](https://base.org/builders/minikit)
- [OnchainKit Documentation](https://onchainkit.xyz)
- [Warpcast Developer Resources](https://warpcast.com/~/developers)
- [Base Developer Portal](https://base.org/builders)

## Contributing

This example is part of the OnchainKit project. Feel free to submit issues and pull requests to help improve the examples and documentation.
