'use client';

import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import { useEffect, useState } from 'react';
import { apiFetch, getIgdbImageUrl } from '../utils/api';
import { Loader2 } from 'lucide-react';

export default function GamesPage() {
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const res = await apiFetch('/games/trending');
            if (res.ok) {
                setGames(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                        Browse <span className="text-gradient">Games</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium">Explore the complete database of trending video games</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {games.map((game) => (
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
                )}
            </div>
        </main>
    );
}
