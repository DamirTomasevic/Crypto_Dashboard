/**
 * Format a number as USD currency
 */
export const formatCurrency = (value: number): string => {
  // For very small values (less than 0.01), use scientific notation
  if (value < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

/**
 * Format a large number with abbreviations (K, M, B)
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

/**
 * Truncate an ethereum address
 */
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Calculate time ago from timestamp
 */
export const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(parseInt(timestamp) * 1000);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

/**
 * Format a token value based on its decimals
 */
export const formatTokenValue = (value: string, decimals: number = 18): string => {

  return (parseFloat(value) / 10 ** decimals).toFixed(4);
  // return (parseFloat(value) / 10 ** decimals).toFixed(4);
};