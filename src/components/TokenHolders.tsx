import React, { useState, useEffect } from "react";
import {
  Users,
  ExternalLink,
  ChevronRight,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { truncateAddress, formatTokenValue } from "../utils/formatters";
import { TokenHolder } from "../types";

interface TokenHoldersProps {
  isLoading: boolean;
  tokenHolders: TokenHolder[];
}

const TokenHolders: React.FC<TokenHoldersProps> = ({
  isLoading,
  tokenHolders,
}) => {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [visibleHolders, setVisibleHolders] = useState<TokenHolder[]>([]);
  const [expandedHolder, setExpandedHolder] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const deployerAddress =
    import.meta.env.VITE_Deployer_ADDRESS.toLowerCase() as string;
  const pulseXMoreWplsLpAddress =
    import.meta.env.VITE_PulseX_MORE_WPLS_LP_ADDRESS.toLowerCase() as string;
  const pulseXMoreDaiLpAddress =
    import.meta.env.VITE_PulseX_MORE_DAI_LP_ADDRESS.toLowerCase() as string;
  const creatorAddress =
    import.meta.env.VITE_Creator_ADDRESS.toLowerCase() as string;

  const contractAddresses = {
    [deployerAddress]: "Deployer",
    [pulseXMoreWplsLpAddress]: "PulseX LP ($MORE/WPLS)",
    [pulseXMoreDaiLpAddress]: "PulseX LP ($MORE/DAI)",
    [creatorAddress]: "Creator",
  };

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const formattedHolders: TokenHolder[] = tokenHolders.map((item) => ({
          address: item.address,
          balance: item.balance * 10 ** 18,
          percentage: item.percentage,
          tag: contractAddresses[item.address.toString().toLowerCase()] ?? "",
        }));

        setHolders(formattedHolders);
        setVisibleHolders(formattedHolders);
      } catch (error) {
        console.error("Error fetching token holders:", error);
      }
    };

    fetchHolders();
  }, [tokenHolders]);

  const handleSort = () => {
    setIsAnimating(true);
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);

    const sortedHolders = [...visibleHolders].sort((a, b) => {
      return newOrder === "desc"
        ? b.percentage - a.percentage
        : a.percentage - b.percentage;
    });

    setTimeout(() => {
      setVisibleHolders(sortedHolders);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setVisibleHolders(holders);
      return;
    }

    const filtered = holders.filter(
      (holder) =>
        holder.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (holder.tag &&
          holder.tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setVisibleHolders(filtered);
  }, [searchTerm, holders]);

  const getAnimationClass = (index: number) => {
    if (isAnimating) {
      return "opacity-0 transition-opacity duration-300";
    }
    return `opacity-100 transition-all duration-300 animate-fadeIn delay-${Math.min(
      index * 100,
      500
    )}`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-8 bg-black/40 rounded w-1/4"></div>
          <div className="h-8 bg-black/40 rounded w-1/3"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-black/40 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-1">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div className="flex items-center">
          <Users size={18} className="text-custom-green mr-2" />
          <h3 className="text-lg font-semibold text-white">
            Top Token Holders
          </h3>
        </div>

        <div className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search address or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom-green text-gray-300 text-sm placeholder-gray-500"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-500"
            />
          </div>

          <button
            onClick={handleSort}
            className="p-2 bg-black/50 border border-gray-700 rounded-lg hover:bg-black/80 transition-colors flex items-center"
          >
            <ArrowUpDown size={16} className="text-custom-green" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-black/50 p-3 text-xs text-gray-400 font-medium">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Address</div>
          <div className="col-span-3 text-right">Balance</div>
          <div className="col-span-2 text-right">Percentage</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-gray-800">
          {visibleHolders.length > 0 ? (
            visibleHolders.map((holder, index) => (
              <div key={holder.address} className={getAnimationClass(index)}>
                <div className="grid grid-cols-12 gap-2 p-3 text-sm hover:bg-black/30 transition-colors">
                  <div className="col-span-1 flex items-center text-gray-400">
                    {index + 1}
                  </div>
                  <div className="col-span-5 flex items-center">
                    <a
                      href={`https://scan.pulsechain.com/address/${holder.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-300 hover:text-custom-green transition-colors"
                    >
                      {truncateAddress(holder.address)}
                      <ExternalLink size={12} className="inline ml-1" />
                    </a>
                    {holder.tag && (
                      <span className="ml-2 px-2 py-0.5 bg-custom-green/10 border border-custom-green/20 rounded-full text-custom-green text-xs">
                        {holder.tag}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 flex items-center justify-end font-mono text-white">
                    {formatTokenValue(holder.balance, 18)} MORE
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="w-full relative">
                      <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center">
                        <div className="h-1 bg-black rounded-full w-full max-w-[50px]">
                          <div
                            className="h-1 bg-gradient-to-r from-custom-green to-custom-green rounded-full"
                            style={{ width: `${holder.percentage * 2}px` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-right text-white font-medium">
                          {holder.percentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      onClick={() =>
                        setExpandedHolder(
                          expandedHolder === holder.address
                            ? null
                            : holder.address
                        )
                      }
                      className="p-1 rounded-full hover:bg-black/50 transition-colors"
                    >
                      <ChevronRight
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          expandedHolder === holder.address ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {expandedHolder === holder.address && (
                  <div className="bg-black/20 p-4 text-sm animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-gray-400 mb-2">
                          Transaction History
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">
                              First Transaction:
                            </span>
                            <span className="text-white">2024-06-15</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">
                              Last Transaction:
                            </span>
                            <span className="text-white">2024-07-03</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">
                              Transaction Count:
                            </span>
                            <span className="text-white">24</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-400 mb-2">Wallet Analytics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Other Tokens:</span>
                            <span className="text-white">8</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">NFTs Owned:</span>
                            <span className="text-white">3</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Wallet Age:</span>
                            <span className="text-white">215 days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-gray-400 mb-2">
                        Recent Transactions
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 text-xs border-b border-gray-800/50">
                          <span className="text-custom-green">
                            Received 12,450 MORE
                          </span>
                          <span className="text-gray-400">3 days ago</span>
                        </div>
                        <div className="flex justify-between items-center py-1 text-xs border-b border-gray-800/50">
                          <span className="text-red-400">Sent 5,000 MORE</span>
                          <span className="text-gray-400">5 days ago</span>
                        </div>
                        <div className="flex justify-between items-center py-1 text-xs border-b border-gray-800/50">
                          <span className="text-custom-green">
                            Received 25,000 MORE
                          </span>
                          <span className="text-gray-400">7 days ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <a
                        href={`https://scan.pulsechain.com/address/${holder.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-xs bg-custom-green/10 hover:bg-custom-green/20 text-custom-green px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Full History
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              No holders found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
        <span>
          Showing {visibleHolders.length} of {holders.length} holders
        </span>
        <a
          href="https://scan.pulsechain.com/token/0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9?tab=holders"
          target="_blank"
          rel="noreferrer"
          className="flex items-center hover:text-custom-green transition-colors"
        >
          View All Holders
          <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default TokenHolders;
