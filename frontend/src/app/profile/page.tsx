'use client';

import Navbar from '../components/Navbar';
import { Settings, Grid, Heart, MessageSquare, Users, Edit3, MapPin, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [myLists, setMyLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editData, setEditData] = useState({ bio: '', profilePicture: '', bannerUrl: '', country: '' });
    const [newPassword, setNewPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (user?.username) {
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const [profileRes, reviewsRes, listsRes] = await Promise.all([
                apiFetch(`/users/${user.username}`),
                apiFetch(`/reviews/user/${user.username}`),
                apiFetch('/lists/my')
            ]);

            if (profileRes.ok) setProfile(await profileRes.json());
            if (reviewsRes.ok) setReviews(await reviewsRes.json());
            if (listsRes.ok) setMyLists(await listsRes.json());
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        try {
            const res = await apiFetch('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(editData)
            });
            if (res.ok) {
                setShowEditModal(false);
                fetchProfileData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const openEditModal = () => {
        setEditData({
            bio: profile?.bio || '',
            profilePicture: profile?.profilePicture || '',
            bannerUrl: profile?.bannerUrl || '',
            country: profile?.country || ''
        });
        setShowEditModal(true);
    };

    const handleChangePassword = async () => {
        if (!newPassword) return;
        setIsChangingPassword(true);
        try {
            const res = await apiFetch('/users/change-password', {
                method: 'POST',
                body: newPassword
            });
            if (res.ok) {
                alert('Password changed successfully!');
                setShowSettingsModal(false);
                setNewPassword('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen bg-[#0a0a0c]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-12 text-center max-w-md"
                    >
                        <Users className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
                        <h2 className="text-3xl font-black mb-4 tracking-tighter">Your Profile Awaits</h2>
                        <p className="text-white/40 mb-8 font-medium">Log in to track your games, write reviews, and connect with other gamers.</p>
                        <Link href="/login" className="block w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                            Log In to Gametify
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0c]">
            <Navbar />

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowEditModal(false)}
                    />
                    <div className="glass-card w-full max-w-lg p-8 relative z-10 border border-white/10 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">Edit Your Profile</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 block">Bio</label>
                                <textarea
                                    value={editData.bio}
                                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                    placeholder="Tell the world about your gaming journey..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium min-h-[100px]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 block">Profile Picture URL</label>
                                <input
                                    type="text"
                                    value={editData.profilePicture}
                                    onChange={(e) => setEditData({ ...editData, profilePicture: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 block">Banner Image URL</label>
                                <input
                                    type="text"
                                    value={editData.bannerUrl}
                                    onChange={(e) => setEditData({ ...editData, bannerUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 block">Country</label>
                                <input
                                    type="text"
                                    value={editData.country}
                                    onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                                    placeholder="Argentina, USA, Spain..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isUpdating}
                                    className="flex-1 bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 bg-white/5 text-white/60 py-4 rounded-xl font-bold border border-white/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowSettingsModal(false)}
                    />
                    <div className="glass-card w-full max-w-md p-8 relative z-10 border border-white/10">
                        <h3 className="text-2xl font-black text-white mb-6 tracking-tighter flex items-center gap-3">
                            <Settings className="w-6 h-6 text-primary" />
                            Account Settings
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2 block">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword || !newPassword}
                                    className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Update Password
                                </button>

                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/';
                                    }}
                                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-xl font-bold border border-red-500/20 transition-all"
                                >
                                    Sign Out
                                </button>

                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className="w-full bg-white/5 text-white/60 py-4 rounded-xl font-bold border border-white/10"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner */}
            <div className="h-80 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20" />
                <img
                    src={profile?.bannerUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070"}
                    className="w-full h-full object-cover opacity-50"
                    alt="profile banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
                <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
                    {/* Avatar */}
                    <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl">
                        <div className="w-full h-full rounded-[1.4rem] bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
                            <img
                                src={profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                className="w-full h-full object-cover"
                                alt="user avatar"
                            />
                        </div>
                    </div>

                    <div className="flex-1 pb-4">
                        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">{user.username}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-white/40 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile?.country || 'Earth'}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Member since 2024</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pb-4">
                        <button
                            onClick={openEditModal}
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold border border-white/10 transition-all flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-all hover:rotate-90"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Info Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <section className="mb-12">
                            <div className="glass-card p-8 border border-white/5 mb-8">
                                <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] mb-4">About Me</h3>
                                <p className="text-lg text-white/70 leading-relaxed font-medium">
                                    {profile?.bio || "This user hasn't added a bio yet. They're too busy playing games!"}
                                </p>
                            </div>

                            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <Grid className="w-6 h-6 text-primary" />
                                My Collections
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                                {myLists.length > 0 ? myLists.map((list) => (
                                    <div key={list.id} className="glass-card p-6 border border-white/5 hover:border-primary/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Grid className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">{list.name}</h4>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{list.gameIds?.length || 0} Games</p>
                                            </div>
                                            <Link href={`/lists/${list.id}`} className="ml-auto p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="w-4 h-4 text-white/40" />
                                            </Link>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-10 text-center glass-card border-dashed">
                                        <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No collections created yet</p>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                Recent Reviews
                            </h2>

                            <div className="space-y-6">
                                {reviews.length > 0 ? reviews.map((review: any) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        key={review.id}
                                        className="glass-card p-8 border border-white/5"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                {review.gameCoverUrl && (
                                                    <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                        <img src={review.gameCoverUrl} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black shrink-0">
                                                    {review.rating.toFixed(1)}
                                                </div>
                                                <div>
                                                    <h4 className="text-white text-lg font-bold">Review for {review.gameName || `Game #${review.gameId}`}</h4>
                                                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-white/60 leading-relaxed text-lg italic">"{review.content}"</p>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20 glass-card">
                                        <p className="text-white/20 font-black uppercase tracking-[0.3em]">No reviews shared yet</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-8 sticky top-32 border border-white/5">
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { label: 'Collections', value: myLists.length, icon: Grid },
                                    { label: 'Reviews', value: reviews.length, icon: MessageSquare },
                                    { label: 'Followers', value: profile?.followers?.length || 0, icon: Users },
                                    { label: 'Following', value: profile?.following?.length || 0, icon: Heart },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-white/30">Level</span>
                                    <span className="text-primary">Gamer Initiate</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
