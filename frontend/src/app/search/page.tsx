'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getIgdbImageUrl, apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import { Loader2, Search } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            fetchResults();
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/games/search?q=${encodeURIComponent(query || '')}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                    Search Results for <span className="text-primary">"{query}"</span>
                </h1>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                    {loading ? 'Consulting IGDB Database...' : `Found ${results.length} matched entities`}
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Accessing Gateway...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {results.map((game) => (
                        <GameCard
                            key={game.id}
                            id={game.id}
                            title={game.name}
                            image={getIgdbImageUrl(game.cover?.url, 't_cover_big')}
                            rating={Math.round(game.total_rating || 0) / 10}
                            year={new Date((game.first_release_date || 0) * 1000).getFullYear()}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 glass-card">
                    <Search className="w-12 h-12 text-white/5 mb-4" />
                    <p className="text-white/20 font-black uppercase tracking-[0.3em]">No results found</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-40 pt-60">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                </div>
            }>
                <SearchContent />
            </Suspense>
        </main>
    );
}
