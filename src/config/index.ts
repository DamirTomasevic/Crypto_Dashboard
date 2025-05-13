export const config = {
  rpc: import.meta.env.VITE_PULSECHAIN_RPC || 'https://rpc.pulsechain.com',
  tokenAddress: import.meta.env.VITE_TOKEN_ADDRESS || '0xbEEf3bB9dA340EbdF0f5bae2E85368140d7D85D0',
  burnAddress: import.meta.env.VITE_BURN_ADDRESS || '0x000000000000000000000000000000000000dEaD',
  
  // API endpoints
  apis: {
    dexscreener: 'https://api.dexscreener.com/latest/dex/tokens',
    moralis: 'https://deep-index.moralis.io/api/v2',
  },
  
  // Polling intervals (ms)
  intervals: {
    price: 60000,       // 1 minute
    marketData: 60000,  // 1 minute
    transfers: 60000,   // 1 minute
    holders: 300000,    // 5 minutes
    burnInfo: 300000,   // 5 minutes
    meta: 3600000       // 1 hour
  },
  
  // Error messages
  errors: {
    rpcError: 'Failed to connect to blockchain',
    priceError: 'Unable to fetch price data',
    transfersError: 'Failed to load transfers',
    holdersError: 'Could not fetch holder data',
    burnError: 'Error loading burn statistics'
  }
};