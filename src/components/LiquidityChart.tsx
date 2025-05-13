import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "../utils/formatters";
import { format } from "date-fns";
import { parseISO } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface LiquidityChartProps {
  isLoading: boolean;
  liquidity: any[];
}

const LiquidityChart: React.FC<LiquidityChartProps> = ({
  isLoading,
  liquidity,
}) => {
  const data = {
    labels: liquidity.map((d) => format(parseISO(d.date), "MMM dd")),
    datasets: [
      {
        fill: true,
        label: "Buy-Side PLS Liquidity",
        data: liquidity.map((d) => d.liquidity),
        borderColor: "#0DFF00",
        backgroundColor: "rgba(13, 255, 0, 0.1)",
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: "#0DFF00",
        pointBorderColor: "#0DFF00",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `Buy-Side Liquidity: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 10,
          },
          callback: (value: number) => formatCurrency(value),
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-[200px] animate-pulse bg-black/40 rounded-lg"></div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default LiquidityChart;
