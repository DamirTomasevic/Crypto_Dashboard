import { useState } from 'react';
import { useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { PULSEX_ROUTER, ROUTER_ABI, WPLS_ADDRESS } from '../lib/contracts';

export interface SwapParams {
  fromToken: string; // 'PLS' for native token or token address
  toToken: string;   // Token address
  amount: string;    // Amount as string (will be parsed)
  slippage: number;  // Slippage as percentage (0.5 = 0.5%)
}

export const useSwap = () => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  
  const swap = async ({ fromToken, toToken, amount, slippage }: SwapParams) => {
    if (!address) {
      setError('Wallet not connected');
      setStatus('error');
      return;
    }
    
    setStatus('pending');
    setError(null);
    setTxHash(null);
    
    try {
      // Calculate minimum output with slippage
      const amountIn = parseEther(amount);
      const slippageBasisPoints = BigInt(Math.floor(slippage * 100));
      const minOutMultiplier = BigInt(10000) - slippageBasisPoints;
      const amountOutMin = (amountIn * minOutMultiplier) / BigInt(10000);
      
      // Set deadline to 20 minutes from now
      const deadline = Math.floor(Date.now() / 1000) + 20 * 60;
      
      // Use native token flow (swapExactETHForTokens)
      if (fromToken === 'PLS') {
        const hash = await writeContractAsync({
          address: PULSEX_ROUTER,
          abi: ROUTER_ABI,
          functionName: 'swapExactETHForTokens',
          args: [
            amountOutMin,
            [WPLS_ADDRESS, toToken],
            address,
            BigInt(deadline)
          ],
          value: amountIn
        });
        
        setTxHash(hash);
        setStatus('success');
        return hash;
      } 
      // TODO: Implement token to token and token to native flows
      else {
        setError('Only native token swaps are supported currently');
        setStatus('error');
      }
    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'Unknown error occurred');
      setStatus('error');
    }
  };
  
  return {
    swap,
    status,
    error,
    txHash,
    reset: () => {
      setStatus('idle');
      setError(null);
      setTxHash(null);
    }
  };
};