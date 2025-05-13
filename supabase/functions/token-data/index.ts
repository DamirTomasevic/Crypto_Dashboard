import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CACHE_DURATION = 60; // 1 minute cache
const TOKEN_ADDRESS = '0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9';
const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cache = await Deno.openKv();
    const cacheKey = ['token-data'];
    const cached = await cache.get(cacheKey);

    if (cached.value && Date.now() - cached.value.timestamp < CACHE_DURATION * 1000) {
      return new Response(JSON.stringify(cached.value.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch price data from DexScreener
    const dexResponse = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`,
      {
        headers: {
          'X-API-KEY': Deno.env.get('DEXSCREENER_API_KEY') || '',
        },
      }
    );
    const dexData = await dexResponse.json();

    // Fetch contract data from RPC
    const rpcUrl = Deno.env.get('PULSECHAIN_RPC') || 'https://rpc.pulsechain.com';
    const [supplyData, burnData] = await Promise.all([
      fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: TOKEN_ADDRESS,
            data: '0x18160ddd' // totalSupply()
          }, 'latest']
        })
      }),
      fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_call',
          params: [{
            to: TOKEN_ADDRESS,
            data: `0x70a08231000000000000000000000000${BURN_ADDRESS.substring(2)}` // balanceOf(address)
          }, 'latest']
        })
      })
    ]);

    const [supplyResult, burnResult] = await Promise.all([
      supplyData.json(),
      burnData.json()
    ]);

    const data = {
      price: dexData.pairs?.[0]?.priceUsd || 0,
      totalSupply: supplyResult.result,
      burnedAmount: burnResult.result,
      timestamp: Date.now()
    };

    // Cache the result
    await cache.set(cacheKey, { data, timestamp: Date.now() });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});