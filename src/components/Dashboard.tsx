import React, { useEffect } from "react";
import { Users, BarChart3, DollarSign } from "lucide-react";
import GlassPanel from "./ui/GlassPanel";
import KpiCard from "./ui/KpiCard";
import PriceChart from "./PriceChart";
import TransfersTable from "./TransfersTable";
import TokenHolders from "./TokenHolders";
import TradingModule from "./TradingModule";
import BurnInfo from "./BurnInfo";
import WalletConnect from "./WalletConnect";
import HoldersChart from "./HoldersChart";
import LiquidityChart from "./LiquidityChart";
import MarketCapChart from "./MarketCapChart";
import useDashboardData from "../hooks/useDataFetching";
import { formatCurrency, formatLargeNumber } from "../utils/formatters";
import { ShinyText } from "./ui/shiny-text";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const Dashboard: React.FC = () => {
  const {
    data,
    loading,
    balanceData,
    refreshTimestamps,
    refreshData,
    refreshBalanceData,
  } = useDashboardData();

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  useEffect(() => {
    handleRefresh();
    fetchLast7Rows();
  }, []);

  const [holdersData, setHoldersData] = useState<any[]>([]);
  const [liquidityData, setLiquidityData] = useState<any[]>([]);
  const [marketCapData, setMarketCapData] = useState<any[]>([]);

  const fetchLast7Rows = async () => {
    const { data, error } = await supabase
      .from("chart_data")
      .select("holders, liquidity, marketcap, date")
      .order("date", { ascending: false })
      .limit(7);

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      // Reverse to get ascending order (oldest first)
      const sortedData = data.reverse();
      const holdersData = sortedData.map((item) => ({
        holders: item.holders,
        date: item.date,
      }));
      const liquidityData = sortedData.map((item) => ({
        liquidity: item.liquidity,
        date: item.date,
      }));
      const marketCapData = sortedData.map((item) => ({
        marketcap: item.marketcap,
        date: item.date,
      }));
      setHoldersData(holdersData);
      setLiquidityData(liquidityData);
      setMarketCapData(marketCapData);
    }
  };
  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1 relative">
              <span className="relative">
                <ShinyText
                  text="MORE DASHBOARD"
                  color="#0DFF00"
                  speed={3}
                  className="font-bold text-3xl"
                />
                <span className="absolute inset-0 -z-10 bg-custom-green/10 blur-xl"></span>
              </span>
              <span className="absolute -inset-1 -z-20 rounded-lg bg-gradient-to-r from-custom-green/20 via-custom-green/5 to-custom-green/20 blur-xl opacity-50 animate-shimmer"></span>
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time metrics and transactions on PulseChain
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <WalletConnect />
          <div
            onClick={handleRefresh}
            className="hover:cursor-pointer inline-flex items-center justify-center px-3 py-3 rounded-lg min-w-[176px] bg-custom-green/10 border border-custom-green/20 text-custom-green hover:bg-custom-green/20 duration-200"
          >
            <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-custom-green"></span>
            <button
              disabled={loading}
              className="hover:cursor-pointer flex items-center justify-center"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Current Price"
          value={formatCurrency(data.price.usdPrice)}
          change={{
            value: data.price["24hrPercentChange"],
            isPositive: data.price["24hrPercentChange"] > 0,
          }}
          updated={refreshTimestamps.price}
          isLoading={loading}
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          title="Market Cap"
          value={formatCurrency(data.marketCap)}
          change={{ value: 3.2, isPositive: true }}
          updated={refreshTimestamps.supply}
          isLoading={loading}
          icon={<BarChart3 size={18} />}
        />
        <KpiCard
          title="Holders"
          value={formatLargeNumber(data.holders)}
          change={{ value: 0.3, isPositive: true }}
          updated={refreshTimestamps.holders}
          isLoading={loading}
          icon={<Users size={18} />}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Chart and Trading Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <GlassPanel title="24h Price Chart">
              <PriceChart data={data.candles} isLoading={false} />
            </GlassPanel>
          </div>

          <div className="lg:col-span-3">
            <GlassPanel
              title="Trade MORE Token"
              className="bg-black/80 hover:border-custom-green/40"
            >
              <TradingModule
                tokenSymbol="MORE"
                tokenAddress={import.meta.env.VITE_TOKEN_ADDRESS}
                currentPrice={data.price.usdPrice}
                plsPrice={data.plsPrice}
                isLoading={loading}
                balanceData={balanceData}
                refreshBalanceData={refreshBalanceData}
              />
            </GlassPanel>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassPanel title="Holders Growth">
            <HoldersChart isLoading={loading} holders={holdersData} />
          </GlassPanel>

          <GlassPanel title="Buy-Side PLS Liquidity">
            <LiquidityChart isLoading={loading} liquidity={liquidityData} />
          </GlassPanel>

          <GlassPanel title="Market Cap Growth">
            <MarketCapChart isLoading={loading} marketCap={marketCapData} />
          </GlassPanel>
        </div>

        {/* Burn Info */}
        <GlassPanel
          title="Token Burn Statistics"
          className="bg-gradient-to-br from-black/70 to-red-950/30 hover:border-red-500/30"
        >
          <BurnInfo
            burnAddress={import.meta.env.VITE_BURN_ADDRESS}
            burnedAmount={data.burnedAmount || "0"}
            totalSupply={data.supply}
            isLoading={loading}
            burnPct={data.burnPct}
          />
        </GlassPanel>

        {/* Token Info and Market Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <GlassPanel title="Recent Transfers">
              <TransfersTable transfers={data.transfers} isLoading={loading} />
            </GlassPanel>
          </div>

          <div className="lg:col-span-4">
            <GlassPanel title="Market Activity" className="h-full">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-black/40 rounded"></div>
                  <div className="h-20 bg-black/40 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    <div className="border-r border-gray-800 pr-4">
                      <h3 className="text-sm text-gray-400 mb-2">24h Volume</h3>
                      <div className="bg-gradient-to-r from-custom-green/20 to-transparent p-2 rounded-lg">
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(data.volume)}
                        </p>
                      </div>
                    </div>
                    <div className="border-r border-gray-800 pr-4">
                      <h3 className="text-sm text-gray-400 mb-2">Liquidity</h3>
                      <div className="bg-gradient-to-r from-custom-green/20 to-transparent p-2 rounded-lg">
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(data.liquidity)}
                        </p>
                        <div className="flex items-center mt-1">
                          {data.liquidityChange > 0 ? (
                            <span className="text-xs bg-custom-green/20 text-custom-green px-2 py-0.5 rounded-full">
                              {data.liquidityChange.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                              {data.liquidityChange.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </GlassPanel>
          </div>
        </div>

        {/* Token Holders - Full Width */}
        <GlassPanel title="Top Token Holders">
          <TokenHolders isLoading={loading} tokenHolders={data.tokenHolders} />
        </GlassPanel>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-xs">
        <p>
          Data provided by PulseChain and Moralis APIs. Updated in real-time.
        </p>
        <p className="mt-1">
          © 2025 MORE Token Dashboard. All prices shown in USD.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
