'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { PropsWithChildren } from 'react';

const wagmiConfig = createConfig({
    chains: [arbitrum, arbitrumSepolia],
    transports: {
        [arbitrum.id]: http(),
        [arbitrumSepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                loginMethods: ['wallet', 'email'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#FF6B6B' as `#${string}`,
                    walletList: [
                        "metamask",
                        "rainbow",
                        "phantom",
                        "coinbase_wallet",
                        "uniswap",
                        "wallet_connect",
                        "rabby_wallet",
                        "safe"
                    ],
                },
                defaultChain: arbitrum,
                supportedChains: [arbitrum, arbitrumSepolia]
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
} 