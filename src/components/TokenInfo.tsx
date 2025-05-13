import React from "react";
import { TokenMetadata } from "../types";
import { ExternalLink, Share2, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface TokenInfoProps {
  metadata: TokenMetadata | null;
  isLoading: boolean;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ metadata, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (metadata) {
      navigator.clipboard.writeText(metadata.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading || !metadata) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-4 bg-black/40 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-black/40 rounded w-full mb-2"></div>
        <div className="h-4 bg-black/40 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="p-1">
      <h3 className="text-sm text-gray-400 mb-2">Token Contract</h3>
      <div className="flex items-center mb-3">
        <a
          href={`https://scan.pulsechain.com/token/${metadata.contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="text-custom-green hover:text-custom-green/80 text-sm font-mono mr-2 truncate"
        >
          {metadata.contractAddress}
        </a>
        <button
          onClick={copyToClipboard}
          className="p-1 rounded-full hover:bg-black/80 transition-colors"
          title="Copy contract address"
        >
          {copied ? (
            <CheckCircle size={14} className="text-custom-green" />
          ) : (
            <Copy size={14} className="text-gray-400 hover:text-white" />
          )}
        </button>
        <a
          href={`https://scan.pulsechain.com/token/${metadata.contractAddress}`}
          target="_blank"
          rel="noreferrer"
          className="p-1 rounded-full hover:bg-black/80 transition-colors ml-1"
          title="View on explorer"
        >
          <ExternalLink size={14} className="text-gray-400 hover:text-white" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
        <div>
          <p className="text-xs text-gray-400">Name</p>
          <p className="text-sm text-white font-medium">{metadata.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Symbol</p>
          <p className="text-sm text-white font-medium">{metadata.symbol}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Decimals</p>
          <p className="text-sm text-white font-medium">{metadata.decimals}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Network</p>
          <p className="text-sm text-white font-medium">PulseChain</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href="https://app.pulsex.com/swap?outputCurrency=0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9"
          target="_blank"
          rel="noreferrer"
          className="text-xs bg-custom-green/20 hover:bg-custom-green/30 text-custom-green px-3 py-1.5 rounded-lg transition-colors flex items-center"
        >
          Trade on PulseX
          <ExternalLink size={12} className="ml-1" />
        </a>

        <button className="text-xs bg-black/50 hover:bg-black/80 text-gray-300 px-3 py-1.5 rounded-lg transition-colors flex items-center">
          Share
          <Share2 size={12} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TokenInfo;
