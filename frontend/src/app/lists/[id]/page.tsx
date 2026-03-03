'use client';

import Navbar from '../../components/Navbar';
import { ListFilter, Loader2, Star, Calendar, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, getIgdbImageUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ListDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [list, setList] = useState<any>(null);
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchListData();
        }
    }, [id]);

    const fetchListData = async () => {
        try {
            const res = await apiFetch(`/lists/${id}`);
            if (res.ok) {
                const listData = await res.json();
                setList(listData);

                if (listData.gameIds && listData.gameIds.length > 0) {
                    const gamesRes = await apiFetch(`/games/batch?ids=${listData.gameIds.join(',')}`);
                    if (gamesRes.ok) {
                        setGames(await gamesRes.json());
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
    );

    if (!list) return (
        <div className="min-h-screen bg-black text-white p-20 text-center">
            <Navbar />
            <h2 className="text-2xl font-bold mt-20">List not found</h2>
            <Link href="/lists" className="text-primary mt-4 inline-block font-bold">Back to Collections</Link>
        </div>
    );

    return (
        <main className="min-h-screen scrollbar-hide">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors font-bold uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                            <ListFilter className="w-6 h-6" />
                        </div>
                        <span className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">Collection Detail</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                        {list.name}
                    </h1>
                    <p className="text-white/40 font-medium text-lg">
                        {games.length} games in this collection • Curated by {list.user?.username || 'You'}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {games.map((game, idx) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group"
                        >
                            <Link href={`/games/${game.id}`}>
                                <div className="glass-card overflow-hidden group-hover:border-primary/50 transition-all border border-white/5">
                                    <div className="aspect-[2/3] overflow-hidden relative">
                                        <img
                                            src={getIgdbImageUrl(game.cover?.url, 't_cover_big')}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            alt={game.name}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-[10px] font-black text-yellow-500">{Math.round(game.total_rating || 0) / 10}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-bold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">{game.name}</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" />
                                            {new Date((game.first_release_date || 0) * 1000).getFullYear()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {games.length === 0 && (
                    <div className="text-center py-40 glass-card">
                        <p className="text-white/20 font-black uppercase tracking-[0.3em]">This collection is empty</p>
                        <Link href="/games" className="text-primary mt-4 inline-block font-bold">Discover Games</Link>
                    </div>
                )}
            </div>
        </main>
    );
}
