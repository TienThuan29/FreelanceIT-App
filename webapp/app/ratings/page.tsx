'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useRating, { CreateRatingInput, RatingDTO, UpdateRatingInput } from '@/hooks/useRating';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const StarInput: React.FC<{
    value: number;
    onChange: (v: number) => void;
    max?: number;
}> = ({ value, onChange, max = 5 }) => {
    return (
        <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: max }).map((_, idx) => {
                const starValue = idx + 1;
                const isActive = starValue <= value;
                return (
                    <button
                        key={idx}
                        type="button"
                        aria-label={`Rate ${starValue}`}
                        onClick={() => onChange(starValue)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 24,
                            color: isActive ? '#f5b301' : '#ccc'
                        }}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default function RatingsPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const { getMy, create, update, remove } = useRating();

    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState<RatingDTO[]>([]);
    const [stars, setStars] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const isEditing = useMemo(() => !!editingId, [editingId]);

    const loadMyRatings = async () => {
        setLoading(true);
        try {
            const data = await getMy();
            setRatings(data);
        } catch {
            // noop
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            loadMyRatings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isAuthenticated]);

    const resetForm = () => {
        setStars(0);
        setComment('');
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stars || stars < 1 || stars > 5) return;

        setLoading(true);
        try {
            if (isEditing && editingId) {
                const input: UpdateRatingInput = { stars, comment };
                await update(editingId, input);
            } else {
                const input: CreateRatingInput = { stars, comment };
                await create(input);
            }
            await loadMyRatings();
            resetForm();
        } catch {
            // noop
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (rating: RatingDTO) => {
        setEditingId(rating.id);
        setStars(rating.stars);
        setComment(rating.comment || '');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this rating?')) return;
        setLoading(true);
        try {
            await remove(id);
            await loadMyRatings();
        } catch {
            // noop
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
                <h2 style={{ fontSize: 24, marginBottom: 8 }}>My Ratings</h2>
                <p>Please sign in to create and manage your ratings.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 24 }}>My Ratings</h2>
                <Link
                    href="/ratings/all"
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    View all ratings
                </Link>
            </div>

            <form onSubmit={handleSubmit} style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, marginBottom: 12 }}>{isEditing ? 'Edit Rating' : 'Create Rating'}</h3>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Stars</label>
                    <StarInput value={stars} onChange={setStars} />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 8 }}>Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6 }}
                        placeholder="Share your thoughts..."
                    />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        type="submit"
                        disabled={loading || !stars}
                        style={{ padding: '8px 12px', background: '#111827', color: '#fff', borderRadius: 6, border: 'none' }}
                    >
                        {isEditing ? 'Update' : 'Submit'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            style={{ padding: '8px 12px', background: '#6b7280', color: '#fff', borderRadius: 6, border: 'none' }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
                    {ratings.map((r) => (
                        <li key={r.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#f5b301', fontSize: 18 }}>{'★'.repeat(r.stars)}</span>
                                    <span style={{ color: '#d1d5db', fontSize: 18 }}>{'★'.repeat(5 - r.stars)}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={() => handleEdit(r)}
                                        style={{ padding: '6px 10px', background: '#2563eb', color: '#fff', borderRadius: 6, border: 'none' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(r.id)}
                                        style={{ padding: '6px 10px', background: '#dc2626', color: '#fff', borderRadius: 6, border: 'none' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
                            <div style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>
                                {new Date(r.createdDate).toLocaleString()}
                            </div>
                        </li>
                    ))}
                    {ratings.length === 0 && <li>No ratings yet.</li>}
                </ul>
            )}
        </div>
    );
}

