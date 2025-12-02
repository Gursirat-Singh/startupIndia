import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import { sanitizeSearchTerm, sanitizeText, sanitizeNumber, sanitizeUrl } from "../utils/sanitize";
import { formatIndianCurrency } from "../utils/formatMoney";

export default function Dashboard() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [minFunding, setMinFunding] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/startups")
      .then((res) => {
        setStartups(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error(err);
      });
  }, []);

  const stats = useMemo(() => {
    if (!startups.length) {
      return {
        total: 0,
        totalFunding: 0,
        avgFunding: 0,
        uniqueStates: 0,
        uniqueSectors: 0,
      };
    }

    const total = startups.length;
    const totalFunding = startups.reduce(
      (sum, s) => sum + (Number(s.funding) || 0),
      0
    );
    const uniqueStates = new Set(startups.map((s) => s.state).filter(Boolean))
      .size;
    const uniqueSectors = new Set(startups.map((s) => s.sector).filter(Boolean))
      .size;

    return {
      total,
      totalFunding,
      avgFunding: total ? Math.round(totalFunding / total) : 0,
      uniqueStates,
      uniqueSectors,
    };
  }, [startups]);

  const uniqueStateOptions = useMemo(
    () =>
      Array.from(
        new Set(
          startups
            .map((s) => s.state)
            .filter(Boolean)
            .map((s) => s.trim())
        )
      ).sort(),
    [startups]
  );

  const uniqueSectorOptions = useMemo(
    () =>
      Array.from(
        new Set(
          startups
            .map((s) => s.sector)
            .filter(Boolean)
            .map((s) => s.trim())
        )
      ).sort(),
    [startups]
  );

  const filteredStartups = useMemo(() => {
    const term = sanitizeSearchTerm(searchTerm);
    const minFundingValue = minFunding
      ? sanitizeNumber(minFunding, { min: 0 })
      : 0;

    return startups.filter((startup) => {
      const name = (startup.name || "").toLowerCase();
      const sector = (startup.sector || "").toLowerCase();
      const state = (startup.state || "").toLowerCase();
      const funding = Number(startup.funding) || 0;

      const matchesSearch =
        !term ||
        name.includes(term) ||
        sector.includes(term) ||
        state.includes(term);

      const matchesState =
        !filterState ||
        (startup.state &&
          startup.state.trim().toLowerCase() ===
            filterState.trim().toLowerCase());

      const matchesSector =
        !filterSector ||
        (startup.sector &&
          startup.sector.trim().toLowerCase() ===
            filterSector.trim().toLowerCase());

      const matchesFunding = funding >= minFundingValue;

      return matchesSearch && matchesState && matchesSector && matchesFunding;
    });
  }, [startups, searchTerm, filterState, filterSector, minFunding]);

  const handleStartupClick = (id) => {
    navigate(`/startup/${id}`);
  };

  const safeWebsite = (url) => {
    const cleaned = sanitizeUrl(url);
    return cleaned || undefined;
  };

  return (
    <div className="dashboard-container">
      {/* Top stats for Indian startup overview */}
      {!loading && !error && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <p className="stat-label">Total Startups</p>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-label">Total Funding</p>
              <p className="stat-value">
                ₹{formatIndianCurrency(stats.totalFunding)}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <p className="stat-label">Avg. Funding / Startup</p>
              <p className="stat-value">
                ₹{formatIndianCurrency(stats.avgFunding)}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-content">
              <p className="stat-label">States & Sectors</p>
              <p className="stat-value">
                {stats.uniqueStates} / {stats.uniqueSectors}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & filters */}
      {!loading && !error && (
        <div className="search-section">
          <div className="filters-container">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by startup name, sector or state (e.g. FinTech, Maharashtra, EdTech)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(sanitizeText(e.target.value, 80))}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="filters-row">
              <div className="filter-item">
                <label className="filter-label">State/Region</label>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(sanitizeText(e.target.value))}
                >
                  <option value="">All Indian States</option>
                  {uniqueStateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Sector</label>
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(sanitizeText(e.target.value))}
                >
                  <option value="">All Sectors</option>
                  {uniqueSectorOptions.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">Minimum Funding</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Min. funding (₹)"
                  value={minFunding}
                  onChange={(e) => setMinFunding(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading startups...</p>
        </div>
      )}

      {error && !loading && (
        <div className="no-results">
          <p>Failed to load startups: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="startups-section">
          <h2 className="section-title">
            Startups {searchTerm && `(${filteredStartups.length})`}
          </h2>

          {filteredStartups.length > 0 ? (
            <div className="startups-grid">
              {filteredStartups.map((startup) => (
                <div
                  key={startup._id}
                  className="startup-card card"
                  onClick={() => handleStartupClick(startup._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-header">
                    <h3 className="startup-name">{startup.name}</h3>
                    <span className="badge badge-primary">
                      {startup.sector || "Sector NA"}
                    </span>
                  </div>

                  <div className="startup-details">
                    <div className="detail-item">
                      <span className="detail-label">State</span>
                      <span className="detail-value">
                        {startup.state || "Not specified"}
                      </span>
                    </div>

                    {typeof startup.funding === "number" && (
                      <div className="detail-item">
                        <span className="detail-label">Funding</span>
                        <span className="detail-value text-primary">
                          ₹{formatIndianCurrency(startup.funding)}
                        </span>
                      </div>
                    )}

                    {safeWebsite(startup.website) && (
                      <div className="detail-item">
                        <span className="detail-label">Website</span>
                        <a
                          href={safeWebsite(startup.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="detail-value"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>
                No startups found for the selected filters. Try clearing some
                filters or changing your search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
