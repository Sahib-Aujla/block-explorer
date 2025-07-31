"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { AssetTransfersCategory,SortingOrder } from "alchemy-sdk";
import alchemy from "@/lib/alchemy";
import { ArrowBigLeft } from "lucide-react";
import SearchBar from "@/components/searchBar";

export default function AddressPage() {
  const { id } = useParams();
  const router = useRouter();

  const [balance, setBalance] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [txs, setTxs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState<number>(3870.79);
  //   useEffect(() => {
  //     const fetchAddressData = async () => {
  //       try {
  //         const bal = await alchemy.core.getBalance(id as string);
  //         const history = await alchemy.core.getAssetTransfers({
  //           fromBlock: "0x0",
  //           toAddress: id as string,
  //           category: [
  //             AssetTransfersCategory.EXTERNAL,
  //             AssetTransfersCategory.ERC20,
  //           ],
  //           maxCount: 25, // ✅ must be a bigint
  //           withMetadata: true, // ✅ optional but useful for timestamps
  //         });
  //         const res = await fetch(
  //           "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  //         );
  //         const data = await res.json();
  //         setEthPrice(data.ethereum.usd);

  //         setBalance((parseFloat(bal.toString()) / 1e18).toFixed(8));
  //         setTxs(history.transfers);
  //       } catch (err) {
  //         console.error(err);
  //         setError("Failed to load address data. Please verify address.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchAddressData();
  //   }, [id]);
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const bal = await alchemy.core.getBalance(id as string);

        const [sent, received, ethRes] = await Promise.all([
          alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: id as string,
            category: [
              AssetTransfersCategory.EXTERNAL,
              AssetTransfersCategory.ERC20,
              AssetTransfersCategory.INTERNAL,
            ],
            maxCount: 50,
            withMetadata: true,
            order: SortingOrder.DESCENDING,
          }),
          alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: id as string,
            category: [
              AssetTransfersCategory.EXTERNAL,
              AssetTransfersCategory.ERC20,
              AssetTransfersCategory.INTERNAL,
            ],
            maxCount: 50,
            withMetadata: true,
            order: SortingOrder.DESCENDING,
          }),
          fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
          ),
        ]);

        const ethData = await ethRes.json();
        setEthPrice(ethData.ethereum.usd);

        // Combine and sort by block timestamp (desc)
        const allTxs = [...sent.transfers, ...received.transfers].sort(
          (a, b) =>
            new Date(b.metadata?.blockTimestamp).getTime() -
            new Date(a.metadata?.blockTimestamp).getTime()
        );

        setBalance((parseFloat(bal.toString()) / 1e18).toFixed(8));
        setTxs(allTxs.slice(0, 25)); // show latest 25
      } catch (err) {
        console.error(err);
        setError("Failed to load address data. Please verify address.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddressData();
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <SearchBar />

        <h1 className="text-4xl font-bold mb-6 text-red-500">Address Error</h1>
        <p className="text-red-300">{error}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
        <SearchBar />
        <h1 className="text-4xl font-bold mb-6 text-green-400">
          Loading address...
        </h1>
        <div className="h-2 w-1/2 bg-zinc-700 animate-pulse rounded" />
      </main>
    );
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold text-green-400 font-display break-all">
          Address Overview
        </h1>
      </motion.div>

      <section className="bg-zinc-800/60 backdrop-blur border border-zinc-700 rounded-xl p-6 shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-2 text-green-300 break-words">
          {id}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p className="text-zinc-400">ETH Balance</p>
            <p className="text-green-200 text-lg font-mono">{balance} ETH</p>
          </div>
          <div>
            <p className="text-zinc-400">Estimated USD Value</p>
            <p className="text-green-200 text-lg font-mono">
              ≈ $
              {(parseFloat(balance || "0") * ethPrice).toLocaleString(
                undefined,
                { maximumFractionDigits: 2 }
              )}
            </p>
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-green-300 mb-4">
          Recent Transactions
        </h2>

        <div className="overflow-x-auto border border-zinc-800 rounded-xl">
          <table className="min-w-full text-sm text-left text-white bg-zinc-900/70">
            <thead className="text-zinc-400 border-b border-zinc-700">
              <tr>
                <th className="py-3 px-4">Txn Hash</th>
                <th className="py-3 px-4">Block</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">From</th>
                <th className="py-3 px-4">To</th>
                <th className="py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx) => (
                <tr
                  key={tx.hash}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                >
                  <td className="py-2 px-4 font-mono text-green-400">
                    <Link href={`/tx/${tx.hash}`} className="underline">
                      {tx.hash.slice(0, 10)}...
                    </Link>
                  </td>
                  <td className="py-2 px-4">{tx.blockNum}</td>
                  <td className="py-2 px-4">
                    {tx.metadata?.blockTimestamp?.split("T")[0]}
                  </td>
                  <td
                    onClick={() => {
                      router.push(`/address/${tx.from}`);
                    }}
                    className="py-2 px-4 break-all underline cursor-ponter"
                  >
                    {tx.from}
                  </td>

                  <td
                    onClick={() => {
                      router.push(`/address/${tx.to}`);
                    }}
                    className="py-2 px-4 break-all underline cursor-pointer"
                  >
                    {tx.to}
                  </td>

                  <td className="py-2 px-4">
                    {tx.value}{" "}
                    ETH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </main>
  );
}
