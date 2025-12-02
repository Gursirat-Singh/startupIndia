import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./analytics.css";

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [individualStartup, setIndividualStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Load specific startup data for individual analytics
      axios
        .get(`http://localhost:5000/api/startups/${id}`)
        .then((res) => {
          setIndividualStartup(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
          console.error(err);
        });
    } else {
      // Load all startups for general analytics
      axios
        .get("http://localhost:5000/api/startups")
        .then((res) => {
          setStartups(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
          console.error(err);
        });
    }
  }, [id]);

  // Calculate analytics data
  const sectorData = startups.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {});

  const stateData = startups.reduce((acc, s) => {
    acc[s.state] = (acc[s.state] || 0) + 1;
    return acc;
  }, {});

  const topSectors = Object.entries(sectorData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topStates = Object.entries(stateData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const getChartColor = (index) => {
    const colors = ["#14B8A6", "#8B5CF6", "#3B82F6", "#F59E0B", "#EF4444"];
    return colors[index % colors.length];
  };

  const maxValue = Math.max(
    ...Object.values(sectorData),
    ...Object.values(stateData)
  );

  // Calculate pie chart data
  const renderPieChart = (data, maxItems = 5) => {
    const entries = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxItems);
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    let currentAngle = 0;

    return entries.map(([label, count], index) => {
      const sliceAngle = (count / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      const isLarge = sliceAngle > 180 ? 1 : 0;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const r = 45;
      const cx = 60;
      const cy = 60;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${isLarge} 1 ${x2} ${y2} Z`;
      const percentage = ((count / total) * 100).toFixed(1);

      currentAngle = endAngle;

      return {
        path,
        color: getChartColor(index),
        label,
        count,
        percentage,
      };
    });
  };

  const sectorPie = renderPieChart(sectorData);
  const statePie = renderPieChart(stateData);

  // If we have an individual startup ID, show specific analytics
  if (id && individualStartup) {
    return (
      <div className="analytics-container">
        {/* Back Button */}
        <button onClick={() => navigate("/")} className="btn-back">
          ← Back to Dashboard
        </button>

        <div className="individual-analytics-header">
          <h1 className="analytics-title">{individualStartup.name} Analytics</h1>
          <p className="analytics-subtitle">Detailed insights for this startup</p>
        </div>

        <div className="individual-metrics">
          <div className="metric-card metric-card-3d">
            <div className="metric-card-inner">
              <span className="stat-icon">🚀</span>
              <div>
                <p className="metric-label">Startup Name</p>
                <p className="metric-value">{individualStartup.name}</p>
              </div>
            </div>
          </div>

          <div className="metric-card metric-card-3d">
            <div className="metric-card-inner">
              <span className="stat-icon">🏷️</span>
              <div>
                <p className="metric-label">Sector</p>
                <p className="metric-value">{individualStartup.sector}</p>
              </div>
            </div>
          </div>

          <div className="metric-card metric-card-3d">
            <div className="metric-card-inner">
              <span className="stat-icon">📍</span>
              <div>
                <p className="metric-label">Location</p>
                <p className="metric-value">{individualStartup.state}</p>
              </div>
            </div>
          </div>

          <div className="metric-card metric-card-3d">
            <div className="metric-card-inner">
              <span className="stat-icon">📅</span>
              <div>
                <p className="metric-label">Founded</p>
                <p className="metric-value">
                  {individualStartup.foundedYear || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="individual-details">
          <div className="detail-card card">
            <h3 className="card-title">Complete Startup Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Email:</strong>
                <span>{individualStartup.email || "Not provided"}</span>
              </div>
              <div className="detail-item">
                <strong>Phone:</strong>
                <span>{individualStartup.phone || "Not provided"}</span>
              </div>
              <div className="detail-item">
                <strong>Website:</strong>
                <span>
                  {individualStartup.website ? (
                    <a href={individualStartup.website} target="_blank" rel="noopener noreferrer">
                      {individualStartup.website} →
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              </div>
              <div className="detail-item">
                <strong>Description:</strong>
                <span>{individualStartup.description || "No description available"}</span>
              </div>
              <div className="detail-item">
                <strong>Status:</strong>
                <span className="status-active">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate(`/startup/${id}`)} className="btn btn-primary">
            ← Back to Startup Details
          </button>
          <button onClick={() => navigate("/analytics")} className="btn btn-secondary">
            View Overall Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger">
          <span>⚠️</span>
          Error loading data: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Enhanced Key Metrics with 3D Effect */}
          <div className="metrics-grid">
            <div className="metric-card metric-card-3d">
              <div className="metric-card-inner">
                <span className="metric-icon">📈</span>
                <div>
                  <p className="metric-label">Total Startups</p>
                  <p className="metric-value">{startups.length}</p>
                </div>
              </div>
            </div>

            <div className="metric-card metric-card-3d">
              <div className="metric-card-inner">
                <span className="metric-icon">🎯</span>
                <div>
                  <p className="metric-label">Unique Sectors</p>
                  <p className="metric-value">
                    {Object.keys(sectorData).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="metric-card metric-card-3d">
              <div className="metric-card-inner">
                <span className="metric-icon">🌍</span>
                <div>
                  <p className="metric-label">States Covered</p>
                  <p className="metric-value">
                    {Object.keys(stateData).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="metric-card metric-card-3d">
              <div className="metric-card-inner">
                <span className="metric-icon">🏆</span>
                <div>
                  <p className="metric-label">Top Sector</p>
                  <p className="metric-value">
                    {topSectors.length > 0
                      ? topSectors[0][0].substring(0, 12)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pie Charts Section */}
          <div className="pie-charts-grid">
            {/* Sector Pie Chart */}
            <div className="pie-chart-card card">
              <h3 className="chart-title">Sector Distribution</h3>
              <div className="pie-chart-container">
                <svg viewBox="0 0 120 120" className="pie-chart">
                  {sectorPie.map((slice, index) => (
                    <path
                      key={index}
                      d={slice.path}
                      fill={slice.color}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                      className="pie-slice"
                    />
                  ))}
                </svg>
                <div className="pie-legend">
                  {sectorPie.map((slice, index) => (
                    <div key={index} className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: slice.color }}
                      ></span>
                      <span className="legend-text">
                        {slice.label.substring(0, 15)}
                      </span>
                      <span className="legend-percentage">
                        {slice.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* State Pie Chart */}
            <div className="pie-chart-card card">
              <h3 className="chart-title">State Distribution</h3>
              <div className="pie-chart-container">
                <svg viewBox="0 0 120 120" className="pie-chart">
                  {statePie.map((slice, index) => (
                    <path
                      key={index}
                      d={slice.path}
                      fill={slice.color}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                      className="pie-slice"
                    />
                  ))}
                </svg>
                <div className="pie-legend">
                  {statePie.map((slice, index) => (
                    <div key={index} className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: slice.color }}
                      ></span>
                      <span className="legend-text">{slice.label}</span>
                      <span className="legend-percentage">
                        {slice.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Bar Charts */}
          <div className="comparison-section">
            <h2 className="section-heading">Data Comparison</h2>
            <div className="charts-grid">
              {/* Sector Distribution */}
              <div className="chart-card card chart-modal-3d">
                <h3 className="chart-title">Top 5 Sectors</h3>
                <div className="chart-content">
                  {topSectors.map(([sector, count], index) => (
                    <div key={sector} className="chart-bar-item">
                      <div className="chart-bar-label">
                        <span className="label-text">{sector}</span>
                        <span className="label-value">{count}</span>
                      </div>
                      <div className="chart-bar-bg">
                        <div
                          className="chart-bar chart-bar-animated"
                          style={{
                            width: `${(count / maxValue) * 100}%`,
                            backgroundColor: getChartColor(index),
                            animationDelay: `${index * 0.1}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State Distribution */}
              <div className="chart-card card chart-modal-3d">
                <h3 className="chart-title">Top 8 States</h3>
                <div className="chart-content">
                  {topStates.map(([state, count], index) => (
                    <div key={state} className="chart-bar-item">
                      <div className="chart-bar-label">
                        <span className="label-text">{state}</span>
                        <span className="label-value">{count}</span>
                      </div>
                      <div className="chart-bar-bg">
                        <div
                          className="chart-bar chart-bar-animated"
                          style={{
                            width: `${(count / maxValue) * 100}%`,
                            backgroundColor: getChartColor(index),
                            animationDelay: `${index * 0.1}s`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats Table */}
          <div className="stats-table-card card chart-modal-3d">
            <h3 className="chart-title">Sector Distribution Details</h3>
            <div className="table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Sector</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sectorData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([sector, count]) => (
                      <tr key={sector}>
                        <td className="sector-name">{sector}</td>
                        <td className="count">{count}</td>
                        <td className="percentage">
                          {((count / startups.length) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
