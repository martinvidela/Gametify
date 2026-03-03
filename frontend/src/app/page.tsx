'use client';

import Navbar from './components/Navbar';
import GameCard from './components/GameCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { apiFetch, getIgdbImageUrl } from './utils/api';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await apiFetch('/games/trending');
      if (res.ok) {
        const data = await res.json();
        setTrending(data.slice(0, 6)); // Top 6 for homepage
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter"
            >
              Track, rate and share <br />
              <span className="text-gradient">every game you play.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium"
            >
              Join the web's largest gaming community. Organize your collection,
              discover new masterpieces, and see what your friends are playing.
            </motion.p>
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <Link href="/games">
                  <button className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-primary/20">
                    Explore Games — Discover More
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-primary/20">
                    Get Started — It's Free
                  </button>
                </Link>
              )}
              <Link href="/games">
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-md border border-white/10">
                  Browse Trending
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white tracking-tighter">Trending <span className="text-gradient">Now</span></h2>
            <Link href="/games" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors">View All</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trending.map((game) => (
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
      </section>

      {/* Community Activity Feed */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Community <span className="text-gradient">Pulse</span></h2>
            <p className="text-white/40 font-medium italic">See what other gamers are saying right now</p>
          </div>

          <ActivityFeed />
        </div>
      </section>
    </main>
  );
}

function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiFetch('/reviews');
        if (res.ok) {
          const data = await res.json();
          // Sort by ID descending to get "recent"
          setActivities(data.sort((a: any, b: any) => b.id - a.id).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {activities.map((activity, idx) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 flex gap-6 group hover:border-primary/30 transition-all"
        >
          <div className="w-20 shrink-0 aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
            <img
              src={activity.gameCoverUrl || `https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              alt={activity.gameName || "game"}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {activity.user?.username?.substring(0, 1).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-white/80">{activity.user?.username}</span>
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-auto italic">Review</span>
            </div>
            <h4 className="text-xs font-black text-primary mb-2 uppercase tracking-tighter">
              {activity.gameName || 'Unknown Game'}
            </h4>
            <p className="text-sm text-white/60 line-clamp-3 mb-4 italic">"{activity.content}"</p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < activity.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} />
                ))}
              </div>
              <span className="text-[10px] text-white/20 font-bold">{new Date(activity.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      ))}
      {activities.length === 0 && (
        <div className="col-span-full text-center py-10 glass-card border-dashed">
          <p className="text-white/20 font-black uppercase tracking-widest text-xs">No community activity yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
