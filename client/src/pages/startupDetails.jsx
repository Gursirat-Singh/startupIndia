
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./startupDetails.css";

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/startups/${id}`)
      .then((res) => {
        setStartup(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-container">
        <div className="alert alert-danger">
          <span>⚠️</span>
          Error loading startup: {error}
        </div>
        <button onClick={() => navigate("/")} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="details-container">
        <div className="alert alert-danger">
          <span>⚠️</span>
          Startup not found
        </div>
        <button onClick={() => navigate("/")} className="btn-back">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="details-container">
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="btn-back">
        ← Back to Dashboard
      </button>

      {/* Details Card */}
      <div className="details-card card">
        <div className="details-header">
          <div>
            <h1 className="details-title">{startup.name}</h1>
            <p className="details-subtitle">{startup.sector}</p>
          </div>
          <span className="badge badge-primary">{startup.sector}</span>
        </div>

        {/* Main Details Grid */}
        <div className="details-grid">
          {/* Left Column */}
          <div className="details-left">
            <div className="detail-section">
              <h3 className="section-title">Basic Information</h3>

              <div className="detail-row">
                <label className="detail-label">State</label>
                <p className="detail-value">{startup.state}</p>
              </div>

              {startup.email && (
                <div className="detail-row">
                  <label className="detail-label">Email</label>
                  <a
                    href={`mailto:${startup.email}`}
                    className="detail-value link"
                  >
                    {startup.email}
                  </a>
                </div>
              )}

              {startup.phone && (
                <div className="detail-row">
                  <label className="detail-label">Phone</label>
                  <a
                    href={`tel:${startup.phone}`}
                    className="detail-value link"
                  >
                    {startup.phone}
                  </a>
                </div>
              )}

              {startup.website && (
                <div className="detail-row">
                  <label className="detail-label">Website</label>
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-value link"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {(startup.foundedYear || startup.description) && (
              <div className="detail-section">
                <h3 className="section-title">Additional Details</h3>

                {startup.foundedYear && (
                  <div className="detail-row">
                    <label className="detail-label">Founded Year</label>
                    <p className="detail-value">{startup.foundedYear}</p>
                  </div>
                )}

                {startup.description && (
                  <div className="detail-row">
                    <label className="detail-label">Description</label>
                    <p className="detail-value description">
                      {startup.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="details-right">
            <div className="stats-card">
              <span className="stat-icon">📊</span>
              <div>
                <p className="stat-label">Sector</p>
                <p className="stat-value">{startup.sector}</p>
              </div>
            </div>

            <div className="stats-card">
              <span className="stat-icon">📍</span>
              <div>
                <p className="stat-label">Location</p>
                <p className="stat-value">{startup.state}</p>
              </div>
            </div>

            {startup.foundedYear && (
              <div className="stats-card">
                <span className="stat-icon">📅</span>
                <div>
                  <p className="stat-label">Founded</p>
                  <p className="stat-value">{startup.foundedYear}</p>
                </div>
              </div>
            )}

            <div className="stats-card">
              <span className="stat-icon">🚀</span>
              <div>
                <p className="stat-label">Status</p>
                <p className="stat-value">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate(`/analytics/${id}`)}
            className="btn btn-secondary"
          >
            View Startup Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
