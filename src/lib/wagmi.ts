import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { pulsechain } from 'viem/chains'

// Project ID from environment or fallback
export const projectId = '770c656a1fb3338b5313d509eaf33632'

const metadata = {
  name: 'MORE Dashboard',
  description: 'Real-time metrics and transactions on PulseChain',
  url: 'https://more.token.dashboard',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Configure supported chains and connection methods
export const config = defaultWagmiConfig({
  chains: [pulsechain], // PulseChain as the primary chain
  projectId,
  metadata,
  enableInjected: true, // MetaMask and other injected wallets
  enableEIP6963: true, // EIP-6963 Support (Wallet Detection)
  enableCoinbase: true, // Coinbase Wallet support
  ssr: false,
  
  // Connection configuration
  connectionOptions: { 
    onConnect() {
      console.log('Wallet connected successfully');
    },
    onDisplayUri(uri: string) {
      console.log('Display URI:', uri);
    },
    enableAnalytics: false,
    showQrModal: true,
    requestTimeout: 30000, // Increased timeout for slower connections
  }
})