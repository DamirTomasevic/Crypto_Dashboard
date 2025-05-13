import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Wallet, LogOut, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { truncateAddress } from '../utils/formatters';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ButtonColorful } from './ui/button-colorful';
import { cn } from '../lib/utils';

const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    watch: true,
  });
  
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnecting'>('idle');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('idle');
    }
  }, [isConnected]);

  const handleConnect = () => {
    setConnectionStatus('connecting');
    open();
  };
  
  const handleDisconnect = () => {
    setConnectionStatus('disconnecting');
    disconnect();
  };
  
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          className="flex items-center gap-2 bg-black/30 hover:bg-black/50 rounded-lg px-3 py-1.5 border border-custom-green/20 transition-colors"
        >
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-custom-green/20 text-custom-green">
            <Check size={12} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm text-custom-green font-medium flex items-center">
              {truncateAddress(address)}
              <ChevronDown size={14} className={`ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </span>
            {balanceLoading ? (
              <span className="text-xs text-gray-400 flex items-center">
                <RefreshCw size={10} className="animate-spin mr-1" /> Loading...
              </span>
            ) : balance ? (
              <span className="text-xs text-gray-400">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            ) : null}
          </div>
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black/90 border border-gray-800 shadow-xl z-50 animate-fadeIn">
            <div className="p-3 border-b border-gray-800">
              <p className="text-xs text-gray-400">Connected as</p>
              <p className="text-sm text-white font-medium truncate">{address}</p>
            </div>
            <div className="p-2">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-2 p-2 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors text-sm"
              >
                <LogOut size={14} />
                {connectionStatus === 'disconnecting' ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <ButtonColorful
      onClick={handleConnect}
      disabled={connectionStatus === 'connecting'}
      className={cn(
        "relative flex items-center gap-1.5 px-4 py-2",
        connectionStatus === 'connecting'
          ? "bg-gray-500/20 text-gray-400 cursor-wait"
          : "bg-custom-green/20 hover:bg-custom-green/30 text-custom-green",
        "text-sm font-medium"
      )}
      label={
        connectionStatus === 'connecting' 
        ? "Connecting..." 
        : "Connect Wallet"
      }
    />
  );
};

export default WalletConnect;