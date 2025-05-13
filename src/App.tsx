import React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import Dashboard from "./components/Dashboard";
import { ShootingStars } from "./components/ui/shooting-stars";
import { config, projectId } from "./lib/wagmi";

const queryClient = new QueryClient();

// Initialize the Web3Modal with custom options for better UX
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#0DFF00",
    "--w3m-color-fg-100": "white",
    "--w3m-color-bg-100": "black",
    "--w3m-color-bg-200": "#1a1a1a",
    "--w3m-border-radius-master": "8px",
  },
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  ],
  mobileWallets: [
    {
      id: "metamask",
      name: "MetaMask",
      links: {
        native: "metamask://",
        universal: "https://metamask.app.link",
      },
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      links: {
        native: "cbwallet://",
        universal: "https://go.cb-w.com",
      },
    },
    {
      id: "trust",
      name: "Trust Wallet",
      links: {
        native: "trust://",
        universal: "https://link.trustwallet.com",
      },
    },
  ],
  desktopWallets: [
    {
      id: "metamask",
      name: "MetaMask",
      links: {
        native: "metamask://",
        universal: "https://metamask.io/download",
      },
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      links: {
        native: "cbwallet://",
        universal: "https://www.coinbase.com/wallet/downloads",
      },
    },
  ],
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-black relative overflow-hidden">
          {/* Shooting Stars Background */}
          <div className="absolute inset-0 z-0">
            <div className="stars absolute inset-0" />
            <ShootingStars
              starColor="#0DFF00"
              trailColor="#0DFF00"
              minSpeed={15}
              maxSpeed={35}
              minDelay={1000}
              maxDelay={3000}
            />
            <ShootingStars
              starColor="#0DFF00"
              trailColor="#0DFF00"
              minSpeed={10}
              maxSpeed={25}
              minDelay={2000}
              maxDelay={4000}
            />
            <ShootingStars
              starColor="#0DFF00"
              trailColor="#0DFF00"
              minSpeed={20}
              maxSpeed={40}
              minDelay={1500}
              maxDelay={3500}
            />
            <style jsx>{`
              .stars {
                background-image: radial-gradient(
                    2px 2px at 20px 30px,
                    rgba(13, 255, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  ),
                  radial-gradient(
                    2px 2px at 40px 70px,
                    rgba(13, 255, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  ),
                  radial-gradient(
                    2px 2px at 50px 160px,
                    rgba(13, 255, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  ),
                  radial-gradient(
                    2px 2px at 90px 40px,
                    rgba(13, 255, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  ),
                  radial-gradient(
                    2px 2px at 130px 80px,
                    rgba(13, 255, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  ),
                  radial-gradient(
                    2px 2px at 160px 120px,
                    rgba(13, 255, 0, 0.5),
                    rgba(0, 0, 0, 0)
                  );
                background-repeat: repeat;
                background-size: 200px 200px;
                animation: twinkle 5s ease-in-out infinite;
                opacity: 0.3;
              }

              @keyframes twinkle {
                0% {
                  opacity: 0.3;
                }
                50% {
                  opacity: 0.5;
                }
                100% {
                  opacity: 0.3;
                }
              }
            `}</style>
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <Dashboard />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
