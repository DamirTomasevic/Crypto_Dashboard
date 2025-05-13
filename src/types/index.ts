export interface TokenMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: string;
  contractAddress: string;
}

export interface TokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
}

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TokenHolder {
  address: string;
  balance: string;
  percentage: number;
  tag?: string;
}

export interface MarketCapData {
  date: string;
  value: number;
}

export interface DashboardData {
  meta: TokenMetadata | null;
  supply: string;
  price: any;
  holders: number;
  transfers: TokenTransfer[];
  candles: CandleData[];
  marketCap: number;
  marketCapHistory: MarketCapData[];
  tokenHolders: TokenHolder[];
  burnAddress?: string;
  burnedAmount?: string;
  burnPct?: string;
  volume: string;
  liquidity: string;
  plsPrice: number;
  liquidityChange: number;
}

export interface DataSourceTimestamps {
  meta: number;
  supply: number;
  price: number;
  holders: number;
  transfers: number;
  candles: number;
  tokenHolders: number;
  burnInfo?: number;
  volume: number;
  liquidity: number;
  plsPrice: number;
}

// Add TradingView to Window interface
declare global {
  interface Window {
    TradingView: any;
  }
}