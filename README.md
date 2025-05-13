# MORE Token Dashboard

A real-time dashboard for tracking MORE token metrics on PulseChain.

## Features

- Real-time price updates
- Token burn tracking
- Holder statistics
- Transfer history
- Trading interface
- Market activity monitoring

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. For production build:
   ```bash
   npm run build
   ```

## Environment Variables

- `VITE_PULSECHAIN_RPC`: PulseChain RPC endpoint
- `VITE_TOKEN_ADDRESS`: MORE token contract address
- `VITE_BURN_ADDRESS`: Burn address for tracking token burns
- `VITE_MORALIS_API_KEY`: (Optional) Moralis API key for additional data
- `VITE_DEXSCREENER_API_KEY`: (Optional) DexScreener API key for price data

## API Integration

The dashboard uses several data sources:

1. PulseChain RPC for contract data
2. DexScreener for price and trading data
3. Moralis for historical data (optional)

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting provider

## Maintenance

- Monitor API rate limits
- Update dependencies regularly
- Check for contract updates

## Support

For technical support or questions, please open an issue in the repository.