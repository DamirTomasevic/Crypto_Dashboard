import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CACHE_DURATION = 60; // 1 minute cache
const TOKEN_ADDRESS = '0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cache = await Deno.openKv();
    const cacheKey = ['transfers'];
    const cached = await cache.get(cacheKey);

    if (cached.value && Date.now() - cached.value.timestamp < CACHE_DURATION * 1000) {
      return new Response(JSON.stringify(cached.value.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch transfer events from RPC
    const rpcUrl = Deno.env.get('PULSECHAIN_RPC') || 'https://rpc.pulsechain.com';
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getLogs',
        params: [{
          address: TOKEN_ADDRESS,
          topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'], // Transfer event
          fromBlock: 'latest',
          toBlock: 'latest'
        }]
      })
    });

    const result = await response.json();
    const transfers = result.result.map(log => ({
      hash: log.transactionHash,
      from: '0x' + log.topics[1].slice(26),
      to: '0x' + log.topics[2].slice(26),
      value: BigInt(log.data).toString(),
      blockNumber: parseInt(log.blockNumber, 16).toString(),
      timeStamp: Date.now().toString()
    }));

    // Cache the result
    await cache.set(cacheKey, { data: transfers, timestamp: Date.now() });

    return new Response(JSON.stringify(transfers), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});