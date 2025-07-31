'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = query.trim();

    if (!trimmed) return;

    // Transaction Hash
    if (/^0x([A-Fa-f0-9]{64})$/.test(trimmed)) {
      router.push(`/tx/${trimmed}`);
    }
    // Address
    else if (/^0x([A-Fa-f0-9]{40})$/.test(trimmed)) {
      router.push(`/address/${trimmed}`);
    }
    // Block Number
    else if (/^\d+$/.test(trimmed)) {
      router.push(`/block/${trimmed}`);
    } else {
      alert('Invalid search input. Enter block number, tx hash, or address.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10 w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-md focus-within:ring-2 ring-green-400 transition">
        <input
          type="text"
          placeholder="Search block number, tx hash or address..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full px-4 py-3 bg-transparent text-white placeholder-zinc-400 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-green-500 text-zinc-900 font-semibold hover:bg-green-400 transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
