import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const PostReview = ({ username }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [purchase, setPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [carYear, setCarYear] = useState('2023');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not logged in
    const currentUser = sessionStorage.getItem('username');
    if (!currentUser && !username) {
      navigate(`/dealer/${id}`);
      return;
    }

    // Fetch Dealer details
    fetch(`/djangoapp/dealer/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.dealer) {
          setDealer(data.dealer);
        }
      })
      .catch((err) => console.error('Error fetching dealer:', err));

    // Fetch Cars for dropdown
    fetch('/djangoapp/get_cars')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.CarModels) {
          setCars(data.CarModels);
          if (data.CarModels.length > 0) {
            setSelectedCar(`${data.CarModels[0].CarMake}|${data.CarModels[0].CarModel}`);
          }
        }
      })
      .catch((err) => console.error('Error fetching cars:', err));
  }, [id, username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reviewText.trim()) {
      setError('Please provide a review description.');
      return;
    }

    setLoading(true);

    let carMake = '';
    let carModel = '';
    if (purchase && selectedCar) {
      const parts = selectedCar.split('|');
      carMake = parts[0] || '';
      carModel = parts[1] || '';
    }

    const payload = {
      name: sessionStorage.getItem('username') || username || 'Anonymous',
      dealership: parseInt(id, 10),
      review: reviewText,
      purchase: purchase,
      purchase_date: purchase ? purchaseDate : '',
      car_make: purchase ? carMake : '',
      car_model: purchase ? carModel : '',
      car_year: purchase ? parseInt(carYear, 10) : 0
    };

    try {
      const res = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        navigate(`/dealer/${id}`);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('Network error while posting review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Link to={`/dealer/${id}`} className="btn btn-outline-secondary btn-sm mb-3">
        <i className="bi bi-arrow-left me-1"></i> Back to Dealer
      </Link>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-primary text-white py-3 px-4 rounded-top-4">
              <h4 className="fw-bold mb-1">
                <i className="bi bi-pencil-square me-2"></i> Write a Review
              </h4>
              <p className="mb-0 small text-white-50">
                {dealer ? `For: ${dealer.full_name || dealer.short_name}` : 'Share your dealership experience'}
              </p>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Review Feedback</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    required
                    placeholder="Tell us about the customer service, pricing, and vehicle condition..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="purchaseCheck"
                    checked={purchase}
                    onChange={(e) => setPurchase(e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="purchaseCheck">
                    I purchased a car from this dealership
                  </label>
                </div>

                {purchase && (
                  <div className="p-3 bg-light rounded-3 mb-4 border">
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="bi bi-car-front me-1"></i> Purchase Details
                    </h6>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Car Make & Model</label>
                        <select
                          className="form-select"
                          value={selectedCar}
                          onChange={(e) => setSelectedCar(e.target.value)}
                        >
                          {cars.map((car, idx) => (
                            <option key={idx} value={`${car.CarMake}|${car.CarModel}`}>
                              {car.CarMake} {car.CarModel} ({car.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Car Model Year</label>
                        <select
                          className="form-select"
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                        >
                          {[2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-12">
                        <label className="form-label fw-semibold">Purchase Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={purchaseDate}
                          onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                  <Link to={`/dealer/${id}`} className="btn btn-secondary px-4">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
