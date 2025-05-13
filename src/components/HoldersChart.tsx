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
import { format, parseISO } from "date-fns";

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

interface HoldersChartProps {
  isLoading: boolean;
  holders: any[];
}

const HoldersChart: React.FC<HoldersChartProps> = ({ isLoading, holders }) => {
  // Generate mock data for the past 7 days

  const data = {
    labels: holders.map((d) => format(parseISO(d.date), "MMM dd")),
    datasets: [
      {
        fill: true,
        label: "Total Holders",
        data: holders.map((d) => parseInt(d.holders)),
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
          label: (context: { parsed: { y: number } }) => {
            return `Holders: ${Math.round(context.parsed.y).toLocaleString()}`;
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
          callback: (value: number) => Math.round(value).toLocaleString(),
          stepSize: 1,
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

export default HoldersChart;
