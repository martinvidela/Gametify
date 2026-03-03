'use client';

import Navbar from '../components/Navbar';
import { ListFilter, Lock, Globe, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function ListsPage() {
    const [lists, setLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchLists();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchLists = async () => {
        try {
            const res = await apiFetch('/lists/my');
            if (res.ok) {
                setLists(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        setIsCreating(true);
        try {
            const res = await apiFetch('/lists', {
                method: 'POST',
                body: JSON.stringify({
                    name: newListName,
                    isPrivate: isPrivate
                })
            });
            if (res.ok) {
                setShowCreateModal(false);
                setNewListName('');
                setIsPrivate(false);
                fetchLists();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                    <h2 className="text-2xl font-bold mb-4">Please log in to see your collections</h2>
                    <Link href="/login" className="bg-primary px-8 py-3 rounded-xl font-bold">Log In</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
                            Your <span className="text-gradient">Collections</span>
                        </h1>
                        <p className="text-white/40 text-lg font-medium max-w-xl">
                            Organize your gaming journey into custom lists and share your taste.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" /> Create New List
                    </button>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <div className="glass-card w-full max-w-md p-8 relative z-10 border border-white/10">
                            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">New Collection</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 block">List Name</label>
                                    <input
                                        type="text"
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        placeholder="e.g. Masterpieces, To Play..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Lock className={`w-5 h-5 ${isPrivate ? 'text-primary' : 'text-white/20'}`} />
                                        <div>
                                            <p className="text-sm font-bold text-white">Private List</p>
                                            <p className="text-[10px] text-white/30 font-medium">Only you can see this list</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsPrivate(!isPrivate)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${isPrivate ? 'bg-primary' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPrivate ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleCreateList}
                                        disabled={isCreating}
                                        className="flex-1 bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Create Collection
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-6 bg-white/5 text-white/60 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-40">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : lists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {lists.map((list) => (
                            <Link key={list.id} href={`/lists/${list.id}`}>
                                <div className="glass-card group cursor-pointer overflow-hidden p-6 hover:border-primary/30 transition-all border border-white/5 h-full">
                                    <div className={`w-full aspect-video rounded-xl mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all`}>
                                        <ListFilter className="w-12 h-12 text-white/10 group-hover:text-primary/50 transition-all" />
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{list.name}</h3>
                                        {list.isPrivate ? <Lock className="w-4 h-4 text-white/20" /> : <Globe className="w-4 h-4 text-white/20" />}
                                    </div>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{list.gameIds?.length || 0} Games</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 glass-card">
                        <ListFilter className="w-12 h-12 text-white/5 mx-auto mb-6" />
                        <p className="text-white/20 font-black uppercase tracking-[0.3em] mb-4">No collections found</p>
                        <p className="text-white/40 text-sm font-medium">Start organizing your games today!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
