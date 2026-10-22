import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dealers = ({ username }) => {
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchDealers = async (state) => {
    setLoading(true);
    let url = '/djangoapp/get_dealers';
    if (state && state !== 'All') {
      url = `/djangoapp/get_dealers/${state}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.dealers) {
        setDealers(data.dealers);
        // Extract states if states list is empty
        if (states.length === 0 && state === 'All') {
          const uniqueStates = [...new Set(data.dealers.map((d) => d.state))].filter(Boolean).sort();
          setStates(uniqueStates);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers('All');
  }, []);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    fetchDealers(newState);
  };

  return (
    <div className="container py-4">
      {/* Hero header */}
      <div className="p-4 mb-4 rounded-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0d6efd 100%)' }}>
        <h1 className="fw-bold mb-2">Dealership Directory</h1>
        <p className="mb-0 lead">
          Browse verified car dealerships across the United States. Filter by state and read certified customer reviews.
        </p>
      </div>

      {/* State Filter Controls */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
        <div className="row align-items-center g-3">
          <div className="col-md-5 d-flex align-items-center gap-2">
            <label className="form-label fw-bold mb-0 text-nowrap">
              <i className="bi bi-funnel-fill text-primary me-1"></i> Filter by State:
            </label>
            <select
              className="form-select"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="All">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-7 text-md-end text-muted small">
            Showing <span className="fw-bold text-dark">{dealers.length}</span> dealerships
            {selectedState !== 'All' && <span> in <strong>{selectedState}</strong></span>}
          </div>
        </div>
      </div>

      {/* Dealers Table */}
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '80px' }}>ID</th>
                <th scope="col">Dealer Name</th>
                <th scope="col">City</th>
                <th scope="col">Address</th>
                <th scope="col">Zip</th>
                <th scope="col">State</th>
                {username && <th scope="col" className="text-center" style={{ width: '150px' }}>Review Dealer</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={username ? 7 : 6} className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading dealerships...
                  </td>
                </tr>
              ) : dealers.length === 0 ? (
                <tr>
                  <td colSpan={username ? 7 : 6} className="text-center py-5 text-muted">
                    No dealerships found for the selected state.
                  </td>
                </tr>
              ) : (
                dealers.map((dealer) => (
                  <tr key={dealer.id}>
                    <td className="fw-semibold text-secondary">{dealer.id}</td>
                    <td>
                      <Link
                        to={`/dealer/${dealer.id}`}
                        className="fw-bold text-primary text-decoration-none"
                      >
                        {dealer.full_name || dealer.short_name}
                      </Link>
                    </td>
                    <td>{dealer.city}</td>
                    <td>{dealer.address}</td>
                    <td>{dealer.zip}</td>
                    <td>
                      <span className="badge bg-secondary-subtle text-dark border">
                        {dealer.state}
                      </span>
                    </td>
                    {username && (
                      <td className="text-center">
                        <Link
                          to={`/postreview/${dealer.id}`}
                          className="btn btn-outline-primary btn-sm px-3"
                        >
                          <i className="bi bi-pencil-square me-1"></i> Review
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dealers;
