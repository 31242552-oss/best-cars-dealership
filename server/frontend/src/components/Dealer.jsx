import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Dealer = ({ username }) => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Dealer Info
        const dealerRes = await fetch(`/djangoapp/dealer/${id}`);
        const dealerData = await dealerRes.json();
        if (dealerData && dealerData.dealer) {
          setDealer(dealerData.dealer);
        }

        // Fetch Reviews with Sentiments
        const reviewsRes = await fetch(`/djangoapp/reviews/dealer/${id}`);
        const reviewsData = await reviewsRes.json();
        if (reviewsData && reviewsData.reviews) {
          setReviews(reviewsData.reviews);
        }
      } catch (err) {
        console.error('Error fetching dealer page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getSentimentDetails = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return { emoji: '😊', badgeClass: 'bg-success', label: 'Positive' };
      case 'negative':
        return { emoji: '🙁', badgeClass: 'bg-danger', label: 'Negative' };
      default:
        return { emoji: '😐', badgeClass: 'bg-secondary', label: 'Neutral' };
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading dealer information and reviews...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/dealers" className="btn btn-outline-secondary btn-sm mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Dealerships
      </Link>

      {dealer && (
        <div className="card shadow-sm border-0 mb-4 p-4 rounded-3 bg-white">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="badge bg-primary-subtle text-primary fw-bold text-uppercase mb-2">
                Dealership #{dealer.id}
              </span>
              <h2 className="fw-bold text-dark mb-2">{dealer.full_name || dealer.short_name}</h2>
              <p className="text-secondary mb-1">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              {username ? (
                <Link to={`/postreview/${dealer.id}`} className="btn btn-primary px-4 py-2">
                  <i className="bi bi-pencil-fill me-1"></i> Post a Review
                </Link>
              ) : (
                <div className="alert alert-info py-2 px-3 small mb-0 d-inline-block">
                  <i className="bi bi-info-circle me-1"></i> Log in to post a review
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <h3 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-chat-quote-fill text-primary"></i> Customer Reviews ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <div className="card border-0 shadow-sm p-4 text-center text-muted">
          No reviews available for this dealership yet. Be the first to post one!
        </div>
      ) : (
        <div className="row g-3">
          {reviews.map((r, index) => {
            const sentiment = getSentimentDetails(r.sentiment);
            return (
              <div key={r.id || index} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-3 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                    <span className="fw-bold text-dark">
                      <i className="bi bi-person-circle text-secondary me-1"></i> {r.name || 'Anonymous'}
                    </span>
                    <span
                      className={`badge ${sentiment.badgeClass} d-flex align-items-center gap-1`}
                      title={`Sentiment: ${sentiment.label}`}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{sentiment.emoji}</span>
                      <span>{sentiment.label}</span>
                    </span>
                  </div>

                  <p className="card-text text-secondary mb-3 flex-grow-1" style={{ minHeight: '60px' }}>
                    "{r.review}"
                  </p>

                  <div className="small bg-light p-2 rounded text-muted">
                    {r.purchase ? (
                      <div>
                        <div><strong>Purchased:</strong> {r.car_make} {r.car_model} ({r.car_year})</div>
                        {r.purchase_date && <div><strong>Date:</strong> {r.purchase_date}</div>}
                      </div>
                    ) : (
                      <span className="text-secondary">Did not purchase a vehicle</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dealer;
