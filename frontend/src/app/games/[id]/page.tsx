'use client';

import Navbar from '../../components/Navbar';
import { Star, Plus, MessageSquare, Globe, Share2, Check, Loader2, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getIgdbImageUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function GameDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addedToList, setAddedToList] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [isPosting, setIsPosting] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [userReview, setUserReview] = useState<any>(null);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [showListModal, setShowListModal] = useState(false);
    const [myLists, setMyLists] = useState<any[]>([]);
    const [isSavingToList, setIsSavingToList] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);

    useEffect(() => {
        fetchGameDetails();
        fetchReviews();
        if (user) {
            checkUserReview();
        }
    }, [id, user]);

    const fetchGameDetails = async () => {
        try {
            const res = await apiFetch(`/games/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setGame(data[0]);
                } else {
                    setGame(null);
                }
            } else {
                setGame(null);
            }
        } catch (err) {
            console.error(err);
            setGame(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await apiFetch(`/reviews/game/${id}`);
            if (res.ok) {
                setReviews(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const checkUserReview = async () => {
        try {
            const res = await apiFetch(`/reviews/my/game/${id}`);
            if (res.ok) {
                const data = await res.json();
                setUserReview(data);
                setReviewContent(data.content);
                setReviewRating(data.rating);
            } else {
                setUserReview(null);
            }
        } catch (err) {
            // Probably 404 which is fine
        }
    };

    const handlePostReview = async () => {
        if (!user) return alert('Login to review');
        setIsPosting(true);
        try {
            const method = userReview ? 'PUT' : 'POST';
            const url = userReview ? `/reviews/${userReview.id}` : '/reviews';
            const res = await apiFetch(url, {
                method,
                body: JSON.stringify({
                    gameId: game.id,
                    gameName: game.name,
                    gameCoverUrl: getIgdbImageUrl(game.cover?.url, 't_cover_big'),
                    rating: reviewRating,
                    content: reviewContent
                })
            });
            if (res.ok) {
                setShowReviewModal(false);
                fetchReviews();
                checkUserReview();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsPosting(false);
        }
    };

    const openListModal = async () => {
        if (!user) return alert('Login to manage lists');
        setShowListModal(true);
        try {
            const res = await apiFetch('/lists/my');
            if (res.ok) {
                setMyLists(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToList = async (listId: number) => {
        setIsSavingToList(true);
        try {
            const res = await apiFetch(`/lists/${listId}/games/${game.id}`, {
                method: 'POST'
            });
            if (res.ok) {
                setAddedToList(true);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000);
                setShowListModal(false);
                // Refresh lists to reflect the change
                const listsRes = await apiFetch('/lists/my');
                if (listsRes.ok) setMyLists(await listsRes.json());
            } else {
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 3000);
            }
        } catch (err) {
            console.error(err);
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 3000);
        } finally {
            setIsSavingToList(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;
    if (!game) return <div className="min-h-screen bg-black text-white p-20 text-center">Game not found</div>;

    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 z-[200] bg-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 border border-white/20"
                    >
                        <Check className="w-5 h-5" />
                        Game successfully added to your list!
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showErrorToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-10 left-1/2 z-[200] bg-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 border border-white/20"
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center text-xs">!</div>
                        Failed to add game. Please try again.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Banner */}
            <div className="h-[60vh] w-full relative">
                <img
                    src={getIgdbImageUrl(game.cover?.url, 't_1080p')}
                    className="w-full h-full object-cover"
                    alt="banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-40 relative z-10 pb-20">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Cover Art */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full md:w-72 shrink-0"
                    >
                        <div className="glass-card p-1 shadow-2xl aspect-[2/3] overflow-hidden">
                            <img
                                src={getIgdbImageUrl(game.cover?.url, 't_cover_big')}
                                className="w-full h-full object-cover rounded-[0.9rem]"
                                alt="cover"
                            />
                        </div>

                        <div className="mt-8 space-y-4">
                            <button
                                onClick={openListModal}
                                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${addedToList
                                    ? 'bg-green-500 text-white shadow-green-500/20'
                                    : 'bg-primary text-white shadow-primary/20 hover:bg-primary/80'
                                    }`}
                            >
                                {addedToList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {addedToList ? 'In your Lists' : 'Add to List'}
                            </button>
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {userReview ? 'Edit Your Review' : 'Write Review'}
                            </button>
                        </div>
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 pt-20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-black text-yellow-500">{Math.round(game.total_rating || 0) / 10}</span>
                            </div>
                            <span className="text-white/40 font-bold uppercase tracking-widest text-xs">
                                {game.genres?.map((g: any) => g.name).join(' • ')}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">{game.name}</h1>

                        <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-3xl">
                            {game.summary}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2">Platforms</h4>
                                <p className="text-sm text-white/80 font-bold">{game.platforms?.map((p: any) => p.name).join(', ')}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2">Released</h4>
                                <p className="text-sm text-primary font-bold">{new Date((game.first_release_date || 0) * 1000).getFullYear()}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2">Social</h4>
                                <div className="flex gap-4">
                                    <Share2 className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
                                    <Globe className="w-4 h-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-32 pt-20 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Member Reviews</h2>
                            <p className="text-white/40 font-medium">What the community is saying about {game.name}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-white/20 font-black mr-2 self-center">Filter by rating:</span>
                            {[5, 4, 3, 2, 1].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setFilterRating(filterRating === star ? null : star)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${filterRating === star
                                        ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                                        }`}
                                >
                                    {star} <Star className={`w-3 h-3 inline-block ml-1 ${filterRating === star ? 'fill-black' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reviews
                            .filter(r => filterRating === null || Math.floor(r.rating) === filterRating)
                            .map((review) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    key={review.id}
                                    className="glass-card p-8 border border-white/5"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black overflow-hidden">
                                                {review.user?.profilePicture ? (
                                                    <img src={review.user.profilePicture} className="w-full h-full object-cover" />
                                                ) : (
                                                    review.user?.username?.substring(0, 1).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">{review.user?.username}</h4>
                                                <div className="flex gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < Math.floor(review.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-white/60 leading-relaxed italic">"{review.content}"</p>
                                </motion.div>
                            ))}

                        {reviews.filter(r => filterRating === null || Math.floor(r.rating) === filterRating).length === 0 && (
                            <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
                                <MessageSquare className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                <p className="text-white/20 font-black uppercase tracking-widest text-sm">No reviews found matching the filter</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List Selection Modal */}
            <AnimatePresence>
                {showListModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowListModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-md p-8 relative z-10 border border-white/10"
                        >
                            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">Add to Collection</h3>
                            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-8">
                                {myLists.map(list => (
                                    <button
                                        key={list.id}
                                        onClick={() => handleAddToList(list.id)}
                                        disabled={isSavingToList}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Grid className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-white tracking-tight">{list.name}</p>
                                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{list.gameIds?.length || 0} Games</p>
                                            </div>
                                        </div>
                                        {list.gameIds?.includes(Number(game.id)) ? <Check className="w-4 h-4 text-green-500" /> : <Plus className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />}
                                    </button>
                                ))}
                                {myLists.length === 0 && (
                                    <div className="text-center py-10 opacity-40">
                                        <p className="text-sm font-medium">You don't have any collections yet.</p>
                                        <Link href="/lists" className="text-primary text-xs font-bold uppercase tracking-widest mt-2 inline-block hover:underline italic">Create one first</Link>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setShowListModal(false)}
                                className="w-full bg-white/5 text-white/60 py-4 rounded-xl font-bold border border-white/10"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReviewModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg p-8 relative z-10"
                        >
                            <h3 className="text-2xl font-black text-white mb-6">Write your review</h3>
                            <div className="flex gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star
                                        key={s}
                                        onClick={() => setReviewRating(s)}
                                        className={`w-8 h-8 cursor-pointer transition-colors ${s <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-white/20 hover:text-yellow-500/50'}`}
                                    />
                                ))}
                            </div>
                            <textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 mb-6 min-h-[150px] outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="What did you think of the adventure?..."
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePostReview}
                                    disabled={isPosting}
                                    className="flex-1 bg-primary hover:bg-primary/80 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Post Review
                                </button>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-6 bg-white/5 text-white/60 py-3 rounded-xl font-bold border border-white/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
