'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface CategoryStarRowProps {
    category: string;
    rating: number;
    setRating: (value: number) => void;
}

export function CategoryStarRow({ category, rating, setRating }: CategoryStarRowProps) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center justify-between py-5 border-b border-border-subtle group">
            <span className="font-body text-sm text-text-primary tracking-wide">{category}</span>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                        <Star
                            className={`w-6 h-6 transition-all duration-300 ${
                                star <= (hover || rating)
                                    ? 'fill-tier-gold text-tier-gold drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                                    : 'text-surface-2'
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
