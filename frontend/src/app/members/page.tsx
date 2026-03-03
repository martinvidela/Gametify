'use client';

import Navbar from '../components/Navbar';
import { Users, Search, Filter, ShieldCheck, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CommunityPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await apiFetch('/users');
            if (res.ok) {
                setMembers(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (member: any) => {
        if (!user) return;
        const isFollowing = member.followers?.some((f: any) => f.username === user.username);
        const endpoint = isFollowing ? `/users/unfollow/${member.username}` : `/users/follow/${member.username}`;

        // Optimistic UI update
        const updatedMembers = members.map(m => {
            if (m.username === member.username) {
                const newFollowers = isFollowing
                    ? m.followers.filter((f: any) => f.username !== user.username)
                    : [...(m.followers || []), { username: user.username }];
                return { ...m, followers: newFollowers };
            }
            return m;
        });
        setMembers(updatedMembers);

        try {
            const res = await apiFetch(endpoint, { method: 'POST' });
            if (!res.ok) {
                fetchMembers(); // Revert on error
            }
        } catch (err) {
            console.error(err);
            fetchMembers(); // Revert on error
        }
    };

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
                            Gaming <span className="text-gradient">Pulse</span>
                        </h1>
                        <p className="text-white/40 text-lg font-medium max-w-xl">
                            Connect with players around the world, share experiences, and find your next squad.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Find members..."
                                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.length > 0 ? members.map((member) => {
                        const isFollowing = member.followers?.some((f: any) => f.username === user?.username);

                        return (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="glass-card p-6 border border-white/5 hover:border-primary/30 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5">
                                        <div className="w-full h-full rounded-[0.9rem] bg-black overflow-hidden flex items-center justify-center">
                                            <img
                                                src={member.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`}
                                                className="w-full h-full object-cover"
                                                alt="member"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">{member.username}</h3>
                                        <div className="flex items-center gap-1 text-[10px] text-primary font-black uppercase tracking-widest">
                                            <ShieldCheck className="w-3 h-3" /> Gamer
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-3 rounded-xl bg-white/5">
                                        <p className="text-xl font-black text-white">{member.followers?.length || 0}</p>
                                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Followers</p>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-white/5">
                                        <p className="text-xl font-black text-white">{member.reviewCount || 0}</p>
                                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Reviews</p>
                                    </div>
                                </div>

                                {user?.username !== member.username && (
                                    <button
                                        onClick={() => handleFollow(member)}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border shadow-lg ${isFollowing
                                            ? 'bg-white/10 text-white border-white/20 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 group-button'
                                            : 'bg-primary text-white border-primary hover:bg-primary/80 shadow-primary/20'
                                            }`}
                                    >
                                        {isFollowing ? (
                                            <>
                                                <UserCheck className="w-4 h-4" />
                                                <span className="group-hover:hidden">Following</span>
                                                <span className="hidden group-hover:block">Unfollow</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4" />
                                                <span>Follow</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                            <p className="text-white/20 font-bold uppercase tracking-widest">Finding legends...</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
