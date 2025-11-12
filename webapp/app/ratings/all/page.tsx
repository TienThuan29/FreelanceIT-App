'use client';

import React, { useEffect, useState } from 'react';
import useRating, { RatingDTO } from '@/hooks/useRating';

const Stars: React.FC<{ value: number }> = ({ value }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#f5b301', fontSize: 18 }}>{'★'.repeat(value)}</span>
            <span style={{ color: '#d1d5db', fontSize: 18 }}>{'★'.repeat(Math.max(0, 5 - value))}</span>
        </div>
    );
};

export default function AllRatingsPage() {
    const { getAll } = useRating();
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState<RatingDTO[]>([]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const data = await getAll();
            setRatings(data);
        } catch {
            // noop
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ maxWidth: 960, margin: '24px auto', padding: 16 }}>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>All Users&apos; Ratings</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
                    {ratings.map((r) => (
                        <li key={r.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Stars value={r.stars} />
                                <div style={{ color: '#6b7280', fontSize: 12 }}>
                                    {new Date(r.createdDate).toLocaleString()}
                                </div>
                            </div>
                            {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
                            <div style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
                                User: {r.userFullname ?? r.userId}
                            </div>
                        </li>
                    ))}
                    {ratings.length === 0 && <li>No ratings available.</li>}
                </ul>
            )}
        </div>
    );
}


