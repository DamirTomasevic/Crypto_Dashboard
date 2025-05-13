import React from "react";
import { TokenTransfer } from "../types";
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import {
  truncateAddress,
  formatTokenValue,
  timeAgo,
} from "../utils/formatters";

interface TransfersTableProps {
  transfers: TokenTransfer[];
  isLoading: boolean;
}

const TransfersTable: React.FC<TransfersTableProps> = ({
  transfers,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-gray-800 py-3">
            <div className="h-6 bg-black/40 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!transfers.length) {
    return <div className="text-gray-400">No recent transfers</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-gray-400 text-xs border-b border-gray-800">
            <th className="text-left py-2 px-2">Tx Hash</th>
            <th className="text-left py-2 px-2">From / To</th>
            <th className="text-right py-2 px-2">Value</th>
            <th className="text-right py-2 px-2">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {transfers.map((transfer) => (
            <tr
              key={transfer.hash}
              className="text-sm hover:bg-black/30 transition-colors"
            >
              <td className="py-2.5 px-2">
                <a
                  href={`https://scan.pulsechain.com/tx/${transfer.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 hover:text-green-300 hover:underline flex items-center"
                >
                  {truncateAddress(transfer.hash)}
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </td>
              <td className="py-2.5 px-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3 text-red-400" />
                    <a
                      href={`https://scan.pulsechain.com/address/${transfer.from}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-300 hover:text-white hover:underline"
                    >
                      {truncateAddress(transfer.from)}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDown className="h-3 w-3 text-green-400" />
                    <a
                      href={`https://scan.pulsechain.com/address/${transfer.to}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-300 hover:text-white hover:underline"
                    >
                      {truncateAddress(transfer.to)}
                    </a>
                  </div>
                </div>
              </td>
              <td className="py-2.5 px-2 text-right font-mono">
                <span className="text-white">
                  {formatTokenValue(transfer.value, 18)} MORE
                </span>
              </td>
              <td className="py-2.5 px-2 text-right text-gray-400">
                {timeAgo(transfer.timeStamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 text-center">
        <a
          href="https://scan.pulsechain.com/token/0x88dF7BEdc5969371A2C9A74690cBB3668061E1E9/token-transfers"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-xs bg-black/50 hover:bg-black/80 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All Transfers
          <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default TransfersTable;
