"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import alchemy from "@/lib/alchemy";
import { ArrowBigLeft } from "lucide-react";
import SearchBar from "@/components/searchBar";

export default function TxPage() {
  const { txId } = useParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tx, setTx] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [receipt, setReceipt] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [block, setBlock] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const txData = await alchemy.core.getTransaction(txId as string);
        const txReceipt = await alchemy.core.getTransactionReceipt(
          txId as string
        );
        const blockData = await alchemy.core.getBlock(
          txData?.blockNumber as number
        );

        setTx(txData);
        setReceipt(txReceipt);
        setBlock(blockData);
      } catch (err) {
        console.error(err);
        setError("Transaction not found or failed to fetch.");
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, [txId]);

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <h1 className="text-4xl font-bold mb-6 text-red-500">
          Transaction Error
        </h1>
        <p className="text-red-300">{error}</p>
      </main>
    );
  }

  if (loading || !tx || !receipt || !block) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <SearchBar />
        <h1 className="text-4xl font-bold mb-6 text-green-400">
          Loading transaction...
        </h1>
        <div className="h-2 w-1/2 bg-zinc-700 animate-pulse rounded" />
      </main>
    );
  }

  const gasUsed = parseInt(receipt.gasUsed.toString());
  const gasPrice = parseInt(tx.gasPrice.toString());
  const valueEth = parseFloat(tx.value.toString()) / 1e18;
  const txnFeeEth = (gasUsed * gasPrice) / 1e18;
  const status = receipt.status === 1 ? "Success" : "Failed";
  const timestamp = new Date(block.timestamp * 1000).toUTCString();

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-10">
      <SearchBar />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <button
          onClick={() => router.back()}
          className="text-green-400 cursor-pointer hover:text-green-200 text-2xl font-bold"
        >
          <ArrowBigLeft />
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-green-400 font-display break-all">
          Transaction Details
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-800/60 backdrop-blur border border-zinc-700 rounded-xl p-6 shadow-lg space-y-4 text-sm"
      >
        <Detail label="Transaction Hash" value={tx.hash} />
        <Detail label="Status" value={status} />
        <Detail
          label="Block"
          value={
            <Link
              href={`/block/${tx.blockNumber}`}
              className="text-green-400 underline hover:text-green-300"
            >
              #{tx.blockNumber}
            </Link>
          }
        />
        <Detail label="Timestamp" value={timestamp} />
        <div className="flex flex-col sm:flex-row sm:items-center py-1">
          <span className="w-48 text-zinc-400 font-medium">From:</span>
          <Link
            href={`/address/${tx.from}`}
            className="cursor-pointer underline"
          >
            <span className="text-green-200 break-all">{tx.from}</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center py-1" >
          <span className="w-48 text-zinc-400 font-medium">To:</span>
          <Link href={`/address/${tx.to}`} className="cursor-pointer underline">
            <span className="text-green-200 break-all">
              {tx.to || "Contract Creation"}
            </span>
          </Link>
        </div>

        <Detail label="Value" value={`${valueEth} ETH`} />
        <Detail label="Transaction Fee" value={`${txnFeeEth} ETH`} />
        <Detail
          label="Gas Price"
          value={`${(gasPrice / 1e9).toFixed(3)} Gwei (${gasPrice} wei)`}
        />
        <Detail
          label="Gas Limit"
          value={`${parseInt(tx.gasLimit.toString()).toLocaleString()}`}
        />
        <Detail
          label="Gas Used"
          value={`${gasUsed.toLocaleString()} (${
            receipt.effectiveGasPrice
          } wei)`}
        />
        <Detail
          label="Txn Type"
          value={`Type ${tx.type} (EIP-${tx.type === 2 ? "1559" : "Legacy"})`}
        />
        <Detail label="Nonce" value={tx.nonce} />
        <Detail label="Position In Block" value={receipt.transactionIndex} />
        <div className="flex flex-col sm:flex-row sm:items-start">
          <span className="w-48 text-zinc-400 font-medium mt-1">
            Input Data:
          </span>
          {tx.input === "0x" ? (
            <span className="text-green-300">0x (empty)</span>
          ) : (
            <pre className="w-full overflow-auto rounded-lg bg-zinc-700 border border-zinc-800 text-green-300 text-xs p-4 mt-2 sm:mt-0">
              {tx.input}
            </pre>
          )}
        </div>
      </motion.div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="w-48 text-zinc-400 font-medium">{label}:</span>
      <span className="text-green-200 break-all">{value}</span>
    </div>
  );
}
