'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import alchemy from '@/lib/alchemy';

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blocks, setBlocks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const latest = await alchemy.core.getBlockNumber();
        const blockData = await Promise.all(
          Array.from({ length: 10 }, (_, i) =>
            alchemy.core.getBlock(latest - i)
          )
        );
        setBlocks(blockData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to fetch blockchain data:', err);
        setError('Failed to fetch blockchain data. Check API key or network.');
      }
    };

    fetchBlocks();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">
          Ethereum Blockchain Explorer
        </h1>
        <div className="rounded-lg bg-red-900/20 border border-red-500 p-4">
          <h2 className="text-red-400 font-semibold mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-display font-bold text-green-400 mb-10"
      >
        Ethereum Blockchain Explorer
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {blocks.map((block) => (
          <motion.div
            key={block.number}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 transition hover:scale-[1.02] hover:shadow-lg hover:border-green-400 cursor-pointer"
          >
            <Link href={`/block/${block.number}`}>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-300">
                  Block #{block.number}
                </h2>
                <p className="text-sm text-zinc-400">
                  {block.transactions.length} Transactions
                </p>
                <p className="text-sm text-zinc-500">
                  Gas Used:{' '}
                  {parseInt(block.gasUsed.toString()).toLocaleString()}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}