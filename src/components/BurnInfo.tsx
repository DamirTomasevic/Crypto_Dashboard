import React, { useState } from "react";
import { Flame, ExternalLink, Info } from "lucide-react";
import { formatLargeNumber, truncateAddress } from "../utils/formatters";

interface BurnInfoProps {
  burnAddress: string;
  burnedAmount: string;
  totalSupply: string;
  isLoading: boolean;
  burnPct?: string;
}

const BurnInfo: React.FC<BurnInfoProps> = ({
  burnAddress,
  burnedAmount,
  totalSupply,
  isLoading,
  burnPct,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate burn percentage from the provided data
  let burnPercentage: number = 0;

  if (burnPct && !isNaN(parseFloat(burnPct))) {
    // Use the provided burn percentage from RPC call
    burnPercentage = parseFloat(burnPct);
  } else if (
    burnedAmount &&
    totalSupply &&
    !isNaN(parseFloat(burnedAmount)) &&
    !isNaN(parseFloat(totalSupply))
  ) {
    // Fallback calculation if direct percentage not available
    const burnedTokens = parseFloat(burnedAmount) / 10 ** 18;
    const totalTokens = parseFloat(totalSupply) / 10 ** 18;
    burnPercentage = (burnedTokens / totalTokens) * 100;
  }

  // Burn tokens in readable format
  const burnedTokens =
    burnedAmount && !isNaN(parseFloat(burnedAmount))
      ? parseFloat(burnedAmount) / 10 ** 18
      : 0;

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-black/40 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-black/40 rounded mb-4"></div>
        <div className="h-16 bg-black/40 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-1">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Burn Address Info */}
        <div className="md:col-span-4">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800/30">
            <h3 className="text-sm text-gray-400 mb-3">Burn Address</h3>
            <div className="flex items-center mb-3">
              <a
                href={`https://scan.pulsechain.com/address/${burnAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 font-mono text-sm truncate"
              >
                {truncateAddress(burnAddress)}
                <ExternalLink size={12} className="inline ml-1" />
              </a>
              <button
                className="ml-2 p-1 rounded-full hover:bg-black/50 transition-colors relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info size={14} className="text-gray-400" />
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black rounded-lg text-xs text-gray-300 w-48 shadow-xl border border-gray-800">
                    Burn address is a zero-address or specialized contract where
                    tokens sent are irretrievably lost, permanently reducing
                    circulating supply.
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Burn Statistics */}
        <div className="md:col-span-8 space-y-5">
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Flame className="text-red-400 mr-2" size={24} />
                  {formatLargeNumber(burnedTokens)} MORE
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Total Tokens Burned Forever
                </p>
              </div>
              <div className="text-right">
                <h4 className="text-2xl font-bold text-red-400">
                  {burnPercentage.toFixed(1)}%
                </h4>
                <p className="text-gray-400 text-sm">of Total Supply</p>
              </div>
            </div>

            {/* Burn Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-black rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${burnPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnInfo;
