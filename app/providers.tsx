"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum, arbitrumSepolia } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

// Define our theme colors
export const themeColors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  background: {
    dark: "#1A1B1E",
    card: "#2C2D31",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A0AEC0",
    accent: "#FFE66D",
  },
};

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet"],
        appearance: {
          theme: "dark",
          accentColor: themeColors.primary as `#${string}`,
          logo: "./favicon.ico",
          walletList: [
            "metamask",
            "rainbow",
            "phantom",
            "coinbase_wallet",
            "uniswap",
            "wallet_connect",
            "rabby_wallet",
            "safe",
          ],
        },
        defaultChain: arbitrum,
        supportedChains: [arbitrum, arbitrumSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
