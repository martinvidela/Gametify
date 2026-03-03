'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface GameCardProps {
    id: number;
    title: String;
    rating: number;
    image: string;
    year: number;
}

export default function GameCard({ id, title, rating, image, year }: GameCardProps) {
    return (
        <Link href={`/games/${id}`}>
            <motion.div
                whileHover={{ y: -10 }}
                className="group relative glass-card overflow-hidden cursor-pointer aspect-[2/3]"
            >
                <img
                    src={image}
                    alt={title.toString()}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-white/90">{rating.toFixed(1)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-1">{title}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">{year}</p>
                </div>

                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 rounded-2xl transition-colors pointer-events-none" />
            </motion.div>
        </Link>
    );
}
