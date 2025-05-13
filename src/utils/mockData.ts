// This file provides mock data for development purposes
// In production, this would be replaced with actual API calls

import { TokenMetadata, TokenTransfer, CandleData } from '../types';

export const mockMeta: TokenMetadata = {
  name: "MORE",
  symbol: "MORE",
  totalSupply: "1000000000000000000000000000",
  decimals: "18",
  contractAddress: "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
};

export const mockSupply = "1000000000000000000000000000";

// Burn address and amount
export const mockBurnAddress = "0x000000000000000000000000000000000000dEaD";
export const mockBurnedAmount = "900000000000000000000000000"; // 900,000,000 tokens (90%)

export const mockPrice = 0.0000275; // Updated to more accurate value

export const mockHolders = 2093; // Updated based on PulseChain data

export const mockTransfers: TokenTransfer[] = [
  {
    blockNumber: "5738921",
    timeStamp: `${Math.floor(Date.now() / 1000) - 120}`,
    hash: "0x2ba04c33cde4b107b56bc8ad01147304407d4297c19be272bccdf6d6f85ce078",
    from: "0x4a7753d58f35efb5f6abe86c72be676fc6e860e8",
    to: "0x92c31a11fad4a320eb8350de9a3073c323c43e36",
    value: "755589536744210000000000",
    tokenName: "MORE",
    tokenSymbol: "MORE",
    tokenDecimal: "18",
    contractAddress: "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
  },
  {
    blockNumber: "5738920",
    timeStamp: `${Math.floor(Date.now() / 1000) - 360}`,
    hash: "0x2963fd1b67c06812ca6042e79fef6678cfa7285a457ba3844ea61e4d337c1f20",
    from: "0x92c31a11fad4a320eb8350de9a3073c323c43e36",
    to: "0x4a7753d58f35efb5f6abe86c72be676fc6e860e8",
    value: "238677768772960000000000",
    tokenName: "MORE",
    tokenSymbol: "MORE",
    tokenDecimal: "18",
    contractAddress: "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
  },
  {
    blockNumber: "5738919",
    timeStamp: `${Math.floor(Date.now() / 1000) - 780}`,
    hash: "0x086e1cfa55bfcea31e828c51ab9d9a8b2bceebdc3a716f477dfd549ef4739e2",
    from: "0x4a7753d58f35efb5f6abe86c72be676fc6e860e8",
    to: "0x92c31a11fad4a320eb8350de9a3073c323c43e36",
    value: "365698581501490000000000",
    tokenName: "MORE",
    tokenSymbol: "MORE",
    tokenDecimal: "18",
    contractAddress: "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
  },
  {
    blockNumber: "5738918",
    timeStamp: `${Math.floor(Date.now() / 1000) - 1500}`,
    hash: "0x4a8566699ed2b07f16ada8abcda093d09952ff41e2a3fd5d8c04281ede69c130",
    from: "0x92c31a11fad4a320eb8350de9a3073c323c43e36",
    to: "0x4a7753d58f35efb5f6abe86c72be676fc6e860e8",
    value: "333176533150260000000000",
    tokenName: "MORE",
    tokenSymbol: "MORE",
    tokenDecimal: "18",
    contractAddress: "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
  },
  {
    blockNumber: "5738917",
    timeStamp: `${Math.floor(Date.now() / 1000) - 3600}`,
    hash: "0x0f2d7c89f1d270f45fd4c1e450fcf3fb5ced1d3aba57e433fc7486f53b98e90",
    from: "0x4a7753d58f35efb5f6abe86c72be676fc6e860e8",
    to: "0x92c31a11fad4a320eb8350de9a3073c323c43e36",
    value: "342506809308110000000000",
    tokenName: "MORE",
    tokenSymbol: "MORE",
    tokenDecimal: "18",
    contractAddress: "0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
  }
];

// Generate 24 hours of candle data
export const generateMockCandles = (): CandleData[] => {
  const candles: CandleData[] = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);
  
  let lastClose = mockPrice;
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    
    // Generate realistic looking candle data
    const volatility = 0.02; // 2% volatility
    const changePercent = (Math.random() - 0.5) * volatility;
    const close = lastClose * (1 + changePercent);
    
    // Create variations for high and low
    const high = Math.max(lastClose, close) * (1 + Math.random() * 0.01);
    const low = Math.min(lastClose, close) * (1 - Math.random() * 0.01);
    
    candles.push({
      timestamp,
      open: lastClose,
      high,
      low,
      close,
      volume: Math.random() * 100000 + 50000
    });
    
    lastClose = close;
  }
  
  return candles;
};

export const mockCandles = generateMockCandles();

// Calculate market cap based on correct price and supply values
// Total supply is 1,000,000,000 tokens with 18 decimals
// At price of 0.0000275, market cap should be $27,500
export const mockMarketCap = mockPrice * (parseFloat(mockSupply) / 10 ** 18);