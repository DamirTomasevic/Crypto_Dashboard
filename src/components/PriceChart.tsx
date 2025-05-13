import React from "react";
import { CandleData } from "../types";

interface PriceChartProps {
  data: CandleData[];
  isLoading: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-64 bg-gray-800/40 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <iframe
        src="https://dexscreener.com/pulsechain/0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9?embed=1&theme=dark&trades=0&info=0"
        style={{
          width: "100%",
          height: "500px",
          minHeight: "400px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "transparent",
        }}
        title="MORE Token Chart on DexScreener"
        allowFullScreen
      />
    </div>
  );
};

export default PriceChart;
