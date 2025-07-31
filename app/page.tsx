"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import alchemy from "@/lib/alchemy";
import SearchBar from "@/components/searchBar";
import { BlockWithTransactions } from "alchemy-sdk";

export default function HomePage() {
  const [blocks, setBlocks] = useState<BlockWithTransactions[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const latest = await alchemy.core.getBlockNumber();
        const blockData = await Promise.all(
          Array.from({ length: 5 }, (_, i) =>
            alchemy.core.getBlockWithTransactions(latest - i)
          )
        );
        setBlocks(blockData);
      } catch (err) {
        console.error("Failed to fetch blockchain data:", err);
        setError("Failed to fetch blockchain data. Check API key or network.");
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
        Ethereum Blockchain Explorer{" "}
        <span className="text-lg italic font-display font-semibold text-green-400 mb-10 p-2">
          Made By Sahib
        </span>
      </motion.h1>

      <SearchBar />

      <motion.div
        className="space-y-12"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 shadow transition-all duration-300"
          >
            <Link href={`/block/${block.number}`}>
              <h2 className="text-xl font-semibold text-green-300 mb-2 cursor-pointer hover:underline">
                Block #{block.number}
              </h2>
            </Link>
            <p className="text-sm text-zinc-400 mb-4">
              Gas Used: {parseInt(block.gasUsed.toString()).toLocaleString()}
            </p>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="min-w-full text-sm text-left text-white bg-zinc-900/70">
                <thead className="text-zinc-400 border-b border-zinc-700">
                  <tr>
                    <th className="py-3 px-4">Txn Hash</th>
                    <th className="py-3 px-4">From</th>
                    <th className="py-3 px-4">To</th>
                    <th className="py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {block.transactions.slice(0, 5).map((tx) => (
                    <tr
                      key={tx.hash}
                      className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                    >
                      <td className="py-2 px-4 text-green-400 font-mono">
                        <Link href={`/tx/${tx.hash}`} className="underline">
                          {tx.hash.slice(0, 10)}...
                        </Link>
                      </td>
                      <td className="py-2 px-4 break-all text-zinc-200">
                        <Link href={`/address/${tx.from}`} className="underline">
                          {tx.from.slice(0, 12)}...
                        </Link>
                      </td>
                      <td className="py-2 px-4 break-all text-zinc-200">
                        {tx.to ? (
                          <Link
                            href={`/address/${tx.to}`}
                            className="underline"
                          >
                            {tx.to.slice(0, 12)}...
                          </Link>
                        ) : (
                          <span className="text-zinc-500 italic">Contract Creation</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-zinc-300">
                        {(parseFloat(tx.value.toString()) / 1e18).toFixed(5)} ETH
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import alchemy from "@/lib/alchemy";
// import SearchBar from "@/components/searchBar";

// export default function HomePage() {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [blocks, setBlocks] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBlocks = async () => {
//       try {
//         const latest = await alchemy.core.getBlockNumber();
//         const blockData = await Promise.all(
//           Array.from({ length: 12 }, (_, i) =>
//             alchemy.core.getBlock(latest - i)
//           )
//         );
//         setBlocks(blockData);
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (err: any) {
//         console.error("Failed to fetch blockchain data:", err);
//         setError("Failed to fetch blockchain data. Check API key or network.");
//       }
//     };

//     fetchBlocks();
//   }, []);

//   if (error) {
//     return (
//       <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
//         <h1 className="text-4xl font-bold mb-8">
//           Ethereum Blockchain Explorer
//         </h1>
//         <div className="rounded-lg bg-red-900/20 border border-red-500 p-4">
//           <h2 className="text-red-400 font-semibold mb-2">Error</h2>
//           <p className="text-red-200">{error}</p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-4xl font-display font-bold text-green-400 mb-10"
//       >
//         Ethereum Blockchain Explorer{" "}
//         <span className="text-lg italic font-display font-semibold text-green-400 mb-10 p-2">
//           {" "}
//           Made By Sahib
//         </span>
//       </motion.h1>

//       <SearchBar />

//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//         initial="hidden"
//         animate="show"
//         variants={{
//           hidden: {},
//           show: {
//             transition: {
//               staggerChildren: 0.1,
//             },
//           },
//         }}
//       >
//         {blocks.map((block) => (
//           <motion.div
//             key={block.number}
//             variants={{
//               hidden: { opacity: 0, y: 20 },
//               show: { opacity: 1, y: 0 },
//             }}
//           >
//             <Link href={`/block/${block.number}`}>
//               <motion.div whileHover={{ scale: 1.02 }}>
//                 <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 shadow transition-all duration-300 hover:shadow-lg hover:border-green-400 cursor-pointer">
//                   <div className="space-y-2">
//                     <h2 className="text-xl  font-semibold text-green-300">
//                       Block #{block.number}
//                     </h2>
//                     <p className="text-sm text-zinc-400 ">
//                       {block.transactions.length} Transactions
//                     </p>
//                     <p className="text-sm text-zinc-500">
//                       Gas Used:{" "}
//                       {parseInt(block.gasUsed.toString()).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             </Link>
//           </motion.div>
//         ))}
//       </motion.div>
//     </main>
//   );
// }
