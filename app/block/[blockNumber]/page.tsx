'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alchemy, Network } from 'alchemy-sdk';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowBigLeft } from 'lucide-react';

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

export default function BlockPage() {
  const { blockNumber } = useParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [block, setBlock] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blockNumber) return;

    const fetchBlock = async () => {
      try {
        const num = parseInt(blockNumber as string);
        if (isNaN(num)) {
          setError('Invalid block number.');
          return;
        }

        const blockData = await alchemy.core.getBlockWithTransactions(num);
        setBlock(blockData);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch block. Please check the number or try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [blockNumber]);

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-red-400">Block Lookup Error</h1>
        <p className="text-red-300">{error}</p>
      </main>
    );
  }

  if (loading || !block) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-400 mb-6"
        >
          Loading Block #{blockNumber}...
        </motion.h1>
        <div className="h-2 w-1/2 bg-zinc-700 animate-pulse rounded" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <button
          onClick={() => router.back()}
          className="text-green-400 cursor-pointer hover:text-green-300 text-2xl font-bold"
          title="Go back"
        >
          <ArrowBigLeft />
        </button>
        <h1 className="text-4xl font-bold text-green-400 font-display">
          Block #{block.number}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-800/60 backdrop-blur border border-zinc-700 rounded-xl p-6 mb-10 shadow-lg space-y-3 text-sm"
      >
        <Detail label="Hash" value={block.hash} />
        <Detail
          label="Parent Hash"
          value={
            <Link
              href={`/block/${block.number - 1}`}
              className="text-green-400 underline hover:text-green-300 break-all"
            >
              {block.parentHash}
            </Link>
          }
        />
        <Detail
          label="Timestamp"
          value={new Date(block.timestamp * 1000).toLocaleString()}
        />
        <Detail
          label="Miner"
          value={
            <Link
              href={`/address/${block.miner}`}
              className="text-green-400 underline hover:text-green-300"
            >
              {block.miner}
            </Link>
          }
        />
        <Detail
          label="Gas Used"
          value={`${parseInt(block.gasUsed.toString()).toLocaleString()} wei`}
        />
        <Detail
          label="Gas Limit"
          value={`${parseInt(block.gasLimit.toString()).toLocaleString()} wei`}
        />
        <Detail
          label="Base Fee Per Gas"
          value={`${block.baseFeePerGas?.toString()} wei`}
        />
        <Detail
          label="Transactions"
          value={`${block.transactions.length} total`}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-green-300">Transactions</h2>
         {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {block.transactions.slice(0, 10).map((tx: any) => (
          <div
            key={tx.hash}
            className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700"
          >
            <Link
              href={`/tx/${tx.hash}`}
              className="text-sm text-green-400 underline break-all"
            >
              {tx.hash}
            </Link>
          </div>
        ))}
        {block.transactions.length > 10 && (
          <p className="text-sm text-zinc-400">
            + {block.transactions.length - 10} more transactions not shown...
          </p>
        )}
      </motion.div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="w-40 text-zinc-400 font-medium">{label}:</span>
      <span className="text-green-200 break-all">{value}</span>
    </div>
  );
}
