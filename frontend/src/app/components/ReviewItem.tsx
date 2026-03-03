import { Star, MessageSquare, Heart, Share2 } from 'lucide-react';

interface ReviewItemProps {
    user: string;
    game: string;
    rating: number;
    content: string;
    likes: number;
    comments: number;
    time: string;
    image?: string;
}

export default function ReviewItem({ user, game, rating, content, likes, comments, time, image }: ReviewItemProps) {
    return (
        <div className="glass-card p-6 mb-6 hover:bg-white/[0.05] transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-xs font-bold">
                        {user[0].toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-white">{user}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-white/80">{rating.toFixed(1)}</span>
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                {image && (
                    <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden shadow-lg border border-white/10">
                        <img src={image} className="w-full h-full object-cover" alt={game} />
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="text-primary font-bold mb-1 group-hover:text-secondary transition-colors cursor-pointer">
                        {game}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed italic line-clamp-3">
                        "{content}"
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-xs text-white/40 hover:text-accent transition-colors">
                    <Heart className="w-4 h-4" /> {likes}
                </button>
                <button className="flex items-center gap-2 text-xs text-white/40 hover:text-primary transition-colors">
                    <MessageSquare className="w-4 h-4" /> {comments}
                </button>
                <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
