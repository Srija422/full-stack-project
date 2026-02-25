import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './FeedbackModal.css';

export default function FeedbackModal({ activity, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return;
        onSubmit?.({ rating, comment });
        setSubmitted(true);
        setTimeout(onClose, 1500);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
                {submitted ? (
                    <div className="feedback-success animate-scale-in">
                        <div className="success-icon">✨</div>
                        <h3>Thank You!</h3>
                        <p>Your feedback has been submitted.</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>Rate This Activity</h2>
                            <button className="modal-close" onClick={onClose}><FiX /></button>
                        </div>
                        <p className="feedback-activity-name">{activity?.title}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="feedback-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`feedback-star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label className="form-label">Your Feedback</label>
                                <textarea
                                    className="form-input feedback-textarea"
                                    placeholder="Share your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '16px' }}
                                disabled={rating === 0}
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
