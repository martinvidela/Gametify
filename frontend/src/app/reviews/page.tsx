'use client';

import Navbar from '../components/Navbar';
import ReviewItem from '../components/ReviewItem';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { Loader2 } from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await apiFetch('/reviews');
            if (res.ok) {
                setReviews(await res.json());
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
            <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                        Latest <span className="text-gradient">Reviews</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium">What the community is playing right now</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewItem
                            key={review.id}
                            user={review.user?.username || "Gamer"}
                            game={review.gameName || `Game #${review.gameId}`}
                            rating={review.rating}
                            likes={0}
                            comments={0}
                            time={new Date(review.createdAt).toLocaleDateString()}
                            content={review.content}
                            image={review.gameCoverUrl}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 text-white/20 font-black uppercase tracking-widest">
                        No reviews yet... be the first!
                    </div>
                )}
            </div>
        </main>
    );
}
