# Coinbase Smart Wallet Integration for LOTRY.FUN

This document provides information about the Coinbase Smart Wallet integration in the LOTRY.FUN project.

## Overview

The project uses Coinbase's Smart Wallet technology to provide a seamless Web3 experience for users. Smart Wallets are account abstraction wallets that simplify the user experience by handling gas fees and complex blockchain interactions behind the scenes.

## Implementation Details

The integration consists of several key components:

1. **Wagmi Configuration** (`app/utils/wagmi.js`):

   - Sets up the Coinbase Smart Wallet connector
   - Configures the blockchain network (Base Sepolia testnet)

2. **Provider Component** (`app/components/Providers.jsx`):

   - Wraps the application with WagmiProvider and QueryClientProvider
   - Enables React Query for managing async state

3. **WalletConnect Component** (`app/components/WalletConnect.jsx`):

   - Handles wallet connection/disconnection
   - Implements Sign-In With Ethereum (SIWE) for authentication
   - Displays wallet connection status and address

4. **Navbar Integration** (`app/components/Navbar.js`):
   - Incorporates the WalletConnect component in the navigation bar

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the Development Server**:

   ```bash
   npm run dev
   ```

3. **Testing the Integration**:
   - Click the "Connect Wallet" button in the navbar
   - Follow the Coinbase Wallet connection prompts
   - Once connected, your wallet address will be displayed

## Additional Configuration

For production deployment, consider:

1. **Updating the nonce generation**:

   - Replace the hardcoded nonce in WalletConnect.jsx with a secure random value
   - Consider implementing a server-side nonce generation system

2. **Adding additional chains**:

   - Modify the wagmi.js file to include additional blockchain networks

3. **Customizing the SIWE message**:
   - Update the statement and other SIWE parameters to match your application's needs

## Resources

- [Coinbase Smart Wallet Documentation](https://docs.base.org/identity/smart-wallet/quickstart/nextjs-project)
- [Wagmi Documentation](https://wagmi.sh/react/getting-started)
- [SIWE Documentation](https://docs.login.xyz/)
