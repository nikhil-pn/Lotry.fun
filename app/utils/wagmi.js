import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const cbWalletConnector = coinbaseWallet({
  appName: "LOTRY.FUN",
  preference: "smartWalletOnly",
});

export const config = createConfig({
  chains: [baseSepolia],
  // turn off injected provider discovery
  multiInjectedProviderDiscovery: false,
  connectors: [cbWalletConnector],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

// The declare module part is TypeScript specific and not needed in JS
// declare module "wagmi" {
//   interface Register {
//     config: typeof config;
//   }
// }
