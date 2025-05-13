import Moralis from "moralis";

export const getTokenPrice = async() => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: 369,
      address: import.meta.env.VITE_TOKEN_ADDRESS,
    });

    return response.raw;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
};

export const getTokenVolumeAndLiquidity = async () => {
  try {
    const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
    },
  };

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/tokens/${import.meta.env.VITE_TOKEN_ADDRESS}/analytics?chain=pulse`,
    options
  );
  const result = await response.json();
  let volumeAndLiquidity = []
  volumeAndLiquidity.push(result?.totalLiquidityUsd)
  volumeAndLiquidity.push(result?.totalSellVolume["24h"] + result?.totalBuyVolume["24h"])
  return volumeAndLiquidity
  } catch (error) {
    console.error("Error fetching token analytics:", error);
    throw error;
  }
};

export const getLiquidityChange = async () => {
  try{
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": import.meta.env.VITE_MORALIS_API_KEY,
      },
    };
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/pairs/${import.meta.env.VITE_PulseX_MORE_WPLS_LP_ADDRESS}/stats?chain=pulse`,
      options
    );
    const result = await response.json();
    return result.liquidityPercentChange["24h"];
  } catch (error) {
    console.error("Error fetching token liquidity change:", error);
    throw error;
  }
}

export const getMarketCap = async () => {
  try {
    const response = await Moralis.EvmApi.token.getTokenMetadata({
      chain: 369,
      addresses: [import.meta.env.VITE_TOKEN_ADDRESS],
    });
    return parseFloat(response.raw[0].market_cap);
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
};

export const getMarketCapHistory = async () => {
  try {
    // Generate mock data for the past 7 days
    // In production, you would fetch this from an API
    const currentMarketCap = await getMarketCap();
    const data = [];
    
    // Start with 90% of current market cap 7 days ago
    const startingMarketCap = currentMarketCap * 0.9;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Create a smooth progression from starting market cap to current
      const marketCapForDay = startingMarketCap + 
        ((currentMarketCap - startingMarketCap) * ((7 - i) / 7));
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: marketCapForDay
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error generating market cap history:", error);
    return [];
  }
};

export const getRecentTransfers = async () => {
  try {
    const response = await Moralis.EvmApi.token.getTokenTransfers({
      chain: 369,
      limit: 5,
      order: "DESC",
      address: import.meta.env.VITE_TOKEN_ADDRESS,
    });

    return response.raw;
  } catch (error) {
    console.error("Error fetching token transfers:", error);
    throw error;
  }
};

export const getTokenHolders = async () => {
  try {
    const response = await Moralis.EvmApi.token.getTokenOwners({
      chain: 369,
      limit: 10,
      order: "DESC",
      tokenAddress: import.meta.env.VITE_TOKEN_ADDRESS,
    });
    return response.json.result;
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
};

export const getHoldersCount = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
      accept: 'application/json',
      'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
    },
  };
  
  const response = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${import.meta.env.VITE_TOKEN_ADDRESS}/holders?chain=pulse`, options)
  const result = await response.json()
  return result.totalHolders
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
}

export const getBurnData = async () => {
  try {
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: 369,
      tokenAddresses: [import.meta.env.VITE_TOKEN_ADDRESS],
      address: import.meta.env.VITE_BURN_ADDRESS,
    });
    return response.raw[0];
  } catch (error) {
    console.error("Error fetching token burns:", error);
    throw error;
  }
}

export const getWpslPrice = async () => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: 369,
      address: import.meta.env.VITE_WPSL_ADDRESS,
    });
 
    return response.raw.usdPrice;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
}

export const getBalance = async (address:string) => {
  try {
      try{
      await Moralis.start({
          apiKey: import.meta.env.VITE_MORALIS_API_KEY,
        });
      }
      catch (error) {
        console.log("")
      }
        const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          chain: 369,
          address: address,
        });

        return response.result[0].balanceFormatted;
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw error;
    }
}

export const getMoreBalance = async (address:string) => {
  try {
      try{
      await Moralis.start({
        apiKey: import.meta.env.VITE_MORALIS_API_KEY,
      });}
      catch{
        console.log("")
      }
  
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        "chain": 369,
        "tokenAddresses": [
          import.meta.env.VITE_TOKEN_ADDRESS
        ],
        "address": address
      });

      return response.raw[0].balance
    } catch (e) {
      console.error(e);
    }
}